import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  // Test Branch
  const branch = await prisma.branch.findMany({ take: 1 });
  console.log("Branch test:", branch);

  // Test Review
  const review = await prisma.review.findMany({ take: 1 });
  console.log("Review test:", review);

  // Add other tables if needed

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
