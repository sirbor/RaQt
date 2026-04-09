/**
 * Loads `.env` then `.env.local` (local overrides) and runs Prisma with the same env.
 * Fails with a clear message if DATABASE_URL is missing (common when env files were never created).
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const dotenv = require('dotenv');

const root = process.cwd();
const envPath = path.join(root, '.env');
const localPath = path.join(root, '.env.local');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}
if (fs.existsSync(localPath)) {
  dotenv.config({ path: localPath, override: true });
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl || !String(dbUrl).trim()) {
  const hasEnv = fs.existsSync(envPath);
  const hasLocal = fs.existsSync(localPath);
  console.error('');
  console.error('  DATABASE_URL is not set.');
  if (!hasEnv && !hasLocal) {
    console.error('  No .env or .env.local was found in the project root.');
  } else if (!hasLocal) {
    console.error('  .env.local is missing (or DATABASE_URL is only in a file Next loaded elsewhere).');
  }
  console.error('');
  console.error('  1. cp .env.example .env.local');
  console.error('  2. Edit DATABASE_URL to your PostgreSQL connection string.');
  console.error('  3. npm run db:migrate');
  console.error('');
  process.exit(1);
}

const dbUrlRaw = String(dbUrl).trim();
if (/^postgresql:\/\/USER(?::|@)/i.test(dbUrlRaw) || /:PASSWORD@/i.test(dbUrlRaw)) {
  console.error('');
  console.error('  DATABASE_URL looks like an unedited example (username "USER" or password "PASSWORD").');
  console.error('  Edit .env.local and use your real PostgreSQL username and password.');
  console.error('  macOS tip: your OS login is often the default DB superuser—try: whoami');
  console.error('  Grant access if needed, e.g. psql postgres -c \'GRANT ALL ON DATABASE kdinsight TO "yourname";\'');
  console.error('');
  process.exit(1);
}

const prismaArgs = process.argv.slice(2);
if (prismaArgs.length === 0) {
  prismaArgs.push('migrate', 'deploy');
}

const result = spawnSync('npx', ['prisma', ...prismaArgs], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
  cwd: root,
});

process.exit(result.status === null ? 1 : result.status);
