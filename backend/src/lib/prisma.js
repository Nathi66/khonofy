import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { env } from '../config/env.js';

// Allow database override for testing
const databaseUrl = process.env.TEST_DATABASE_URL || env.databaseUrl;

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('render.com') ? { rejectUnauthorized: false } : undefined,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
