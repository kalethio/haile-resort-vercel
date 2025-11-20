// scripts/fix-superadmin-password.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function fixSuperAdminPassword() {
  try {
    const newPassword = "admin123";
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update ONLY the Super Admin account
    const result = await prisma.user.update({
      where: {
        email: "superadmin@haileresorts.com",
      },
      data: {
        password: hashedPassword,
      },
    });

    console.log("✅ Password reset successful for superadmin@haileresorts.com");
    console.log("🔑 Temporary password: admin123");
  } catch (error) {
    console.error("❌ Error resetting password:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSuperAdminPassword();
