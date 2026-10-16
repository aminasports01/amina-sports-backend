-- CreateEnum
CREATE TYPE "PersonalEntryStatus" AS ENUM ('PAID', 'UNPAID', 'RECEIVED');

-- CreateEnum
CREATE TYPE "PersonalEntryType" AS ENUM ('COST', 'RECEIVED');

-- CreateEnum
CREATE TYPE "ClearanceStatus" AS ENUM ('COMPLETED', 'PENDING');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('PERSONAL', 'CENTRAL');

-- CreateTable
CREATE TABLE "personal_entries" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "PersonalEntryStatus" NOT NULL,
    "type" "PersonalEntryType" NOT NULL,
    "quantity" INTEGER,
    "priceRmb" DECIMAL(12,2),
    "shippingCharge" DECIMAL(12,2),
    "paidReceivedBy" TEXT,
    "platform" TEXT,
    "clearanceStatus" "ClearanceStatus" NOT NULL DEFAULT 'PENDING',
    "accountType" "AccountType" NOT NULL DEFAULT 'PERSONAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_entries_pkey" PRIMARY KEY ("id")
);
