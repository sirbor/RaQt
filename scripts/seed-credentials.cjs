/**
 * Upserts a User row for local/staging sign-in. Loads `.env` then `.env.local` (same as other db scripts).
 *
 * Usage:
 *   1. Set SEED_USER_EMAIL and SEED_USER_PASSWORD in .env.local (8+ characters).
 *   2. Optional: SEED_USER_ROLE=ADMIN | CLIENT (default ADMIN).
 *   3. npm run db:seed
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const root = process.cwd();
const envPath = path.join(root, '.env');
const localPath = path.join(root, '.env.local');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}
if (fs.existsSync(localPath)) {
  dotenv.config({ path: localPath, override: true });
}

if (!process.env.DATABASE_URL?.trim()) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env.local and run npm run db:migrate first.');
  process.exit(1);
}

const email = process.env.SEED_USER_EMAIL?.trim().toLowerCase();
const password = process.env.SEED_USER_PASSWORD;
const roleRaw = (process.env.SEED_USER_ROLE || 'ADMIN').trim().toUpperCase();
const role = roleRaw === 'CLIENT' ? 'CLIENT' : 'ADMIN';

if (!email || !password) {
  console.error('');
  console.error('  Missing SEED_USER_EMAIL or SEED_USER_PASSWORD in .env.local');
  console.error('');
  console.error('  Add for example:');
  console.error('    SEED_USER_EMAIL="you@example.com"');
  console.error('    SEED_USER_PASSWORD="your-secure-password-here"');
  console.error('    SEED_USER_ROLE="ADMIN"   # optional');
  console.error('');
  console.error('  Then run: npm run db:seed');
  console.error('');
  process.exit(1);
}

if (password.length < 8) {
  console.error('SEED_USER_PASSWORD must be at least 8 characters (same rule as registration).');
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash, role },
    update: { passwordHash, role },
  });
  console.log(`OK: upserted ${email} as ${role}. You can sign in at /sign-in?flow=login`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
