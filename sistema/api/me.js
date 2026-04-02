import { jwtVerify } from "jose";
export default async function handler(req, res) {
  const token = req.cookies?.token || req.headers.cookie?.match(/token=([^;]+)/)?.[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return res.status(200).json({ ok: true, user: payload.user });
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
