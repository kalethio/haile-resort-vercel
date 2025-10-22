/*
  Warnings:

  - The primary key for the `Branch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `accommodations` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `attractions` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `experiences` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `seo` on the `Branch` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Branch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `slug` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Attraction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "externalId" TEXT,
    "label" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "branchId" INTEGER NOT NULL,
    CONSTRAINT "Attraction_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Accommodation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "branchId" INTEGER NOT NULL,
    CONSTRAINT "Accommodation_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "externalId" TEXT,
    "title" TEXT,
    "description" TEXT,
    "highlightImage" TEXT,
    "branchId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Experience_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Package" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "image" TEXT,
    "ctaLabel" TEXT,
    "experienceId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Package_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BranchSeo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "description" TEXT,
    "keywords" JSONB,
    "branchId" INTEGER NOT NULL,
    CONSTRAINT "BranchSeo_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "country" TEXT NOT NULL,
    "branchId" INTEGER NOT NULL,
    CONSTRAINT "Location_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "action" TEXT NOT NULL,
    "actor" TEXT,
    "branchId" INTEGER,
    "changes" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Branch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "directionsUrl" TEXT,
    "locationUrl" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "starRating" INTEGER,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Branch" ("branchName", "createdAt", "description", "directionsUrl", "heroImage", "id", "published", "starRating", "updatedAt") SELECT "branchName", "createdAt", "description", "directionsUrl", "heroImage", "id", "published", "starRating", "updatedAt" FROM "Branch";
DROP TABLE "Branch";
ALTER TABLE "new_Branch" RENAME TO "Branch";
CREATE UNIQUE INDEX "Branch_slug_key" ON "Branch"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "BranchSeo_branchId_key" ON "BranchSeo"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_branchId_key" ON "Location"("branchId");
