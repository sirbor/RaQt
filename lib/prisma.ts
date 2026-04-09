import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

/**
 * Vercel Storage / Marketplace integrations vary: Neon and Prisma Postgres usually set
 * `DATABASE_URL`. Older templates may only expose `POSTGRES_URL` or `POSTGRES_PRISMA_URL`.
 */
function resolvedDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL
  );
}

const datasourceUrl = resolvedDatabaseUrl();

// Prisma still validates env("DATABASE_URL") from schema.prisma at runtime.
// If the host only provides POSTGRES_URL/POSTGRES_PRISMA_URL, mirror it.
if (!process.env.DATABASE_URL && datasourceUrl) {
  process.env.DATABASE_URL = datasourceUrl;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    ...(datasourceUrl
      ? {
          datasources: {
            db: { url: datasourceUrl },
          },
        }
      : {}),
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
