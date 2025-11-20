/*
  Warnings:

  - You are about to drop the `WebsitePackage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `diff` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `branchId` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "WebsitePackage_branchId_available_idx";

-- AlterTable
ALTER TABLE "JobOpening" ADD COLUMN "deadline" DATETIME;
ALTER TABLE "JobOpening" ADD COLUMN "experienceLevel" TEXT;
ALTER TABLE "JobOpening" ADD COLUMN "responsibilities" JSONB;
ALTER TABLE "JobOpening" ADD COLUMN "salaryRange" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WebsitePackage";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ApiConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "apiKey" TEXT,
    "config" JSONB,
    "lastTest" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RoomFeature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "branchId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "targetCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "sentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_RoomFeatureToRoomType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_RoomFeatureToRoomType_A_fkey" FOREIGN KEY ("A") REFERENCES "RoomFeature" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RoomFeatureToRoomType_B_fkey" FOREIGN KEY ("B") REFERENCES "RoomType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuditLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "action" TEXT NOT NULL,
    "userId" INTEGER,
    "userEmail" TEXT,
    "targetType" TEXT,
    "targetId" INTEGER,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branchId" INTEGER,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AuditLog" ("action", "branchId", "createdAt", "id", "targetId", "targetType", "userId") SELECT "action", "branchId", "createdAt", "id", "targetId", "targetType", "userId" FROM "AuditLog";
DROP TABLE "AuditLog";
ALTER TABLE "new_AuditLog" RENAME TO "AuditLog";
CREATE TABLE "new_Guest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "preferences" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "branchId" INTEGER NOT NULL,
    "guestType" TEXT NOT NULL DEFAULT 'REGULAR',
    "company" TEXT,
    "notes" TEXT,
    "totalStays" INTEGER NOT NULL DEFAULT 0,
    "totalNights" INTEGER NOT NULL DEFAULT 0,
    "lifetimeValue" REAL NOT NULL DEFAULT 0,
    "lastStayAt" DATETIME,
    CONSTRAINT "Guest_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Guest" ("branchId", "createdAt", "email", "firstName", "id", "lastName", "phone", "preferences", "updatedAt") SELECT "branchId", "createdAt", "email", "firstName", "id", "lastName", "phone", "preferences", "updatedAt" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE UNIQUE INDEX "Guest_email_key" ON "Guest"("email");
CREATE INDEX "Guest_branchId_email_idx" ON "Guest"("branchId", "email");
CREATE TABLE "new_GuestFavoritePackage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guestId" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GuestFavoritePackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GuestFavoritePackage_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GuestFavoritePackage" ("createdAt", "guestId", "id", "packageId") SELECT "createdAt", "guestId", "id", "packageId" FROM "GuestFavoritePackage";
DROP TABLE "GuestFavoritePackage";
ALTER TABLE "new_GuestFavoritePackage" RENAME TO "GuestFavoritePackage";
CREATE UNIQUE INDEX "GuestFavoritePackage_guestId_packageId_key" ON "GuestFavoritePackage"("guestId", "packageId");
CREATE TABLE "new_Package" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "image" TEXT,
    "price" REAL,
    "duration" TEXT,
    "inclusions" JSONB,
    "category" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "ctaLabel" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "branchId" INTEGER NOT NULL,
    "experienceId" INTEGER,
    CONSTRAINT "Package_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Package_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Package" ("createdAt", "ctaLabel", "description", "experienceId", "externalId", "id", "image", "subtitle", "title") SELECT "createdAt", "ctaLabel", "description", "experienceId", "externalId", "id", "image", "subtitle", "title" FROM "Package";
DROP TABLE "Package";
ALTER TABLE "new_Package" RENAME TO "Package";
CREATE INDEX "Package_branchId_available_idx" ON "Package"("branchId", "available");
CREATE INDEX "Package_experienceId_idx" ON "Package"("experienceId");
CREATE INDEX "Package_category_idx" ON "Package"("category");
CREATE TABLE "new_PackageBooking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "packageTitle" TEXT NOT NULL,
    "packageDescription" TEXT,
    "packagePrice" REAL NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "additionalServices" JSONB,
    "guestCount" INTEGER NOT NULL,
    "specialInstructions" TEXT,
    "bookingId" TEXT NOT NULL,
    "packageId" INTEGER NOT NULL,
    CONSTRAINT "PackageBooking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PackageBooking_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PackageBooking" ("additionalServices", "bookingId", "endDate", "guestCount", "id", "packageDescription", "packageId", "packagePrice", "packageTitle", "specialInstructions", "startDate") SELECT "additionalServices", "bookingId", "endDate", "guestCount", "id", "packageDescription", "packageId", "packagePrice", "packageTitle", "specialInstructions", "startDate" FROM "PackageBooking";
DROP TABLE "PackageBooking";
ALTER TABLE "new_PackageBooking" RENAME TO "PackageBooking";
CREATE INDEX "PackageBooking_packageId_startDate_idx" ON "PackageBooking"("packageId", "startDate");
CREATE TABLE "new_PackageMedia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isHighlight" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "packageId" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,
    CONSTRAINT "PackageMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PackageMedia_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PackageMedia" ("id", "isHighlight", "mediaId", "order", "packageId") SELECT "id", "isHighlight", "mediaId", "order", "packageId" FROM "PackageMedia";
DROP TABLE "PackageMedia";
ALTER TABLE "new_PackageMedia" RENAME TO "PackageMedia";
CREATE INDEX "PackageMedia_packageId_isHighlight_idx" ON "PackageMedia"("packageId", "isHighlight");
CREATE UNIQUE INDEX "PackageMedia_packageId_mediaId_key" ON "PackageMedia"("packageId", "mediaId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "roleId" INTEGER,
    "branchId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("branchId", "createdAt", "email", "id", "name") SELECT "branchId", "createdAt", "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_branchId_roleId_idx" ON "User"("branchId", "roleId");
CREATE INDEX "User_email_status_idx" ON "User"("email", "status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Permission_module_action_idx" ON "Permission"("module", "action");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_roleId_module_action_key" ON "Permission"("roleId", "module", "action");

-- CreateIndex
CREATE INDEX "RoomFeature_branchId_available_idx" ON "RoomFeature"("branchId", "available");

-- CreateIndex
CREATE UNIQUE INDEX "_RoomFeatureToRoomType_AB_unique" ON "_RoomFeatureToRoomType"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomFeatureToRoomType_B_index" ON "_RoomFeatureToRoomType"("B");
