import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '@prisma/client';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl?.includes('render.com') ? { rejectUnauthorized: false } : undefined,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const DEMO_PASSWORD = 'Demo123!';

const DEMO_USERS = [
  {
    email: 'luis@khonofy.local',
    fullName: 'Luis',
    role: UserRole.superuser,
  },
  {
    email: 'john@khonofy.local',
    fullName: 'John',
    role: UserRole.admin,
  },
  {
    email: 'nathii@khonofy.local',
    fullName: 'Nathii',
    role: UserRole.staff,
  },
];

async function ensureDepartment() {
  let department = await prisma.department.findFirst({
    where: { name: 'Operations' },
  });

  if (!department) {
    department = await prisma.department.create({
      data: {
        name: 'Operations',
        description: 'Default department for Khonofy demo accounts',
      },
    });
  }

  return department;
}

async function upsertDemoUser({ email, fullName, role }, passwordHash, departmentId) {
  return prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      role,
      passwordHash,
      departmentId,
    },
    create: {
      email,
      fullName,
      role,
      passwordHash,
      departmentId,
    },
  });
}

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const department = await ensureDepartment();

  for (const demoUser of DEMO_USERS) {
    await upsertDemoUser(demoUser, passwordHash, department.id);
  }

  console.log('Demo accounts seeded (password for all: %s)', DEMO_PASSWORD);
  console.log('');
  console.log('| Role      | Name   | Email                 |');
  console.log('|-----------|--------|-----------------------|');
  console.log('| Superuser | Luis   | luis@khonofy.local    |');
  console.log('| Admin     | John   | john@khonofy.local    |');
  console.log('| Staff     | Nathii | nathii@khonofy.local  |');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
