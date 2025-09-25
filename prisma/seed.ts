import { PrismaClient } from '@prisma/client';
import { getPasswordHash } from '../src/utils/hashPassword';

const prisma = new PrismaClient();

async function main() {
  const hash = await getPasswordHash('Password1234!');
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'Admin@gmail.com' },
  });
  if (existingAdmin) {
    console.log(`Admin already exists`);
    return;
  }
  const admin = await prisma.user.create({
    data: {
      email: 'Admin@gmail.com',
      name: 'Admin Doe',
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
