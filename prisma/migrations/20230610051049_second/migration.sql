-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isToken" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
