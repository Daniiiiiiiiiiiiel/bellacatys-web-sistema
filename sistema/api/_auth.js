import { jwtVerify } from 'jose';

export async function verifyAuth(req) {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/token=([^;]+)/);
  const token = match ? match[1] : null;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
