import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const u = await prisma.user.create({
    data: { email: "test@example.com", name: "Prisma Tester" },
  });
  console.log("Created:", u);
  const all = await prisma.user.findMany();
  console.log("All users:", all);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
