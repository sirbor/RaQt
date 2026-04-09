import type { NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';

/** If env is incomplete, sends JSON and returns true (handler should return). */
export function respondIfMissingAuthEnv(res: NextApiResponse): boolean {
  if (!process.env.DATABASE_URL?.trim()) {
    res.status(503).json({
      error: 'database_not_configured',
      message:
        'DATABASE_URL is not set. Copy .env.example to .env.local and add your PostgreSQL connection string.',
    });
    return true;
  }
  const jwt = process.env.ADMIN_JWT_SECRET;
  if (!jwt || jwt.length < 32) {
    res.status(503).json({
      error: 'jwt_not_configured',
      message: 'ADMIN_JWT_SECRET must be set to at least 32 random characters.',
    });
    return true;
  }
  return false;
}

export function prismaErrorToResponse(e: unknown): {
  status: number;
  body: Record<string, unknown>;
} | null {
  if (e instanceof Prisma.PrismaClientInitializationError) {
    return {
      status: 503,
      body: {
        error: 'database_unavailable',
        message:
          'Cannot connect to the database. Check DATABASE_URL, SSL options, and that PostgreSQL is reachable.',
      },
    };
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2021') {
      return {
        status: 503,
        body: {
          error: 'migration_required',
          message:
            'The User table (or schema) is missing. From the project root run: npx prisma migrate deploy',
        },
      };
    }
  }
  if (e instanceof Error) {
    if (e.message.includes('ADMIN_JWT_SECRET')) {
      return {
        status: 503,
        body: { error: 'jwt_not_configured', message: e.message },
      };
    }
    if (/relation\s+"(?:public\.)?User"|table\s+"(?:public\.)?User"/i.test(e.message)) {
      return {
        status: 503,
        body: {
          error: 'migration_required',
          message:
            'Database tables are missing. From the project root run: npx prisma migrate deploy',
        },
      };
    }
  }
  return null;
}
