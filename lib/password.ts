import bcrypt from 'bcryptjs';

const ROUNDS = 12;
const MIN_PASSWORD_LEN = 8;

export function assertPasswordValid(password: string): void {
  if (password.length < MIN_PASSWORD_LEN) {
    throw new Error(`password_min_${MIN_PASSWORD_LEN}`);
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(plain: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(plain, passwordHash);
}
