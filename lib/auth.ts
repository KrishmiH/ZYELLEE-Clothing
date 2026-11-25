import { SignJWT, jwtVerify } from "jose";

const secret = process.env.ADMIN_SESSION_SECRET;

if (!secret) {
  throw new Error("ADMIN_SESSION_SECRET is not configured.");
}

const secretKey = new TextEncoder().encode(secret);

export async function createAdminToken() {
  return await new SignJWT({
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);

    return payload.role === "admin";
  } catch {
    return false;
  }
}
