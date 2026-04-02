import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const prisma = new PrismaClient();
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const attempts = {};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Credenciales requeridas" });

  const ip = req.headers["x-forwarded-for"] || "unknown";
  const key = `${ip}:${username}`;
  const now = Date.now();
  if (attempts[key]) {
    const { count, until } = attempts[key];
    if (count >= MAX_ATTEMPTS && now < until)
      return res.status(429).json({ error: "Demasiados intentos. Espera 15 minutos." });
    if (now >= until) delete attempts[key];
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    const valid = admin && await bcrypt.compare(password, admin.password);
    if (!valid) {
      attempts[key] = attempts[key]
        ? { count: attempts[key].count + 1, until: Date.now() + LOCK_MINUTES * 60000 }
        : { count: 1, until: Date.now() + LOCK_MINUTES * 60000 };
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    delete attempts[key];

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ sub: String(admin.id), user: admin.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

    res.setHeader("Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=7200; SameSite=Strict${process.env.NODE_ENV==="production"?"; Secure":""}`
    );
    return res.status(200).json({ ok: true });
  } finally {
    await prisma.$disconnect();
  }
}
