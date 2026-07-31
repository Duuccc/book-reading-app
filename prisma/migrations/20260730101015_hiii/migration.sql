/*
  Warnings:

  - You are about to drop the column `createdAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "createdAt",
DROP COLUMN "isRead",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false;
