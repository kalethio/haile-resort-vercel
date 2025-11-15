-- DropIndex
DROP INDEX "ChatbotResponse_branchId_active_role_idx";

-- AlterTable
ALTER TABLE "ChatbotResponse" ADD COLUMN "type" TEXT DEFAULT 'RESPONSE';

-- CreateIndex
CREATE INDEX "ChatbotResponse_branchId_active_role_type_idx" ON "ChatbotResponse"("branchId", "active", "role", "type");
