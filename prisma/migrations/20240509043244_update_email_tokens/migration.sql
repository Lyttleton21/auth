/*
  Warnings:

  - You are about to drop the `Email_Tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Email_Tokens";

-- CreateTable
CREATE TABLE "Email_Token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Email_Token_pkey" PRIMARY KEY ("identifier","token")
);
