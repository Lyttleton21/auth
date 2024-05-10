-- CreateTable
CREATE TABLE "Email_Tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Email_Tokens_pkey" PRIMARY KEY ("id","token")
);
