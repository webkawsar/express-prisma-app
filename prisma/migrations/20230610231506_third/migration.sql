/*
  Warnings:

  - You are about to drop the column `isToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isToken",
ADD COLUMN     "resetToken" TEXT;
