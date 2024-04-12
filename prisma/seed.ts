// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { Role } from '../src/lib/enums/roles.enum';
const prisma = new PrismaClient();

async function main() {
  for (const role of Object.values(Role)) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
