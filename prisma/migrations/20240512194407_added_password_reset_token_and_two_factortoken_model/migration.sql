/*
  Warnings:

  - You are about to drop the `fake` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "fake";

-- CreateTable
CREATE TABLE "passwordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "passwordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twoFactorTokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "twoFactorTokens_pkey" PRIMARY KEY ("id")
);
