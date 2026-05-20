-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verificationExpires" TIMESTAMP(3),
ALTER COLUMN "passwordHash" DROP NOT NULL;
