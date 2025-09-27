import { PrismaClient } from '@prisma/client';
import { getPasswordHash } from '../src/utils/hashPassword';

const prisma = new PrismaClient();

async function main() {
  const hash = await getPasswordHash(
    process.env.ADMIN_PASSWORD || 'myPassword',
  );
  const existingAdmin = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL },
  });
  if (existingAdmin) {
    console.log(`Admin already exists`);
    return;
  }
  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'email@demo.com',
      full_name: 'Admin Doe',
      role: 'ADMIN',
      password: {
        create: {
          hash,
        },
      },
    },
  });
  console.log('Admin created successfullly!', admin);
}

main()
  .catch((e) => {
    console.error(`Error seeding database:`, (e as Error).message);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
