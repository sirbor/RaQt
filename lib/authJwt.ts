import * as jose from 'jose';
import type { UserRole } from '@prisma/client';

const MIN_SECRET_LEN = 32;

function getSecretKey(): Uint8Array {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s || s.length < MIN_SECRET_LEN) {
    throw new Error(
      `ADMIN_JWT_SECRET must be set and at least ${MIN_SECRET_LEN} characters (use a long random string).`,
    );
  }
  return new TextEncoder().encode(s);
}

export type SessionPayload = { email: string; role: UserRole };

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new jose
    .SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, getSecretKey());
    const email = payload.email;
    const role = payload.role;
    if (typeof email !== 'string' || !email.trim()) return null;
    if (role !== 'ADMIN' && role !== 'CLIENT') return null;
    return { email: email.trim().toLowerCase(), role };
  } catch {
    return null;
  }
}
