/*
  Warnings:

  - The primary key for the `Email_Token` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Email_Token" DROP CONSTRAINT "Email_Token_pkey",
ADD CONSTRAINT "Email_Token_pkey" PRIMARY KEY ("identifier");
