import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { env } from '../config/env.js';

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUrl.includes('render.com') ? { rejectUnauthorized: false } : undefined,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
