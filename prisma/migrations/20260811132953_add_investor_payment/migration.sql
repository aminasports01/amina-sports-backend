-- CreateEnum
CREATE TYPE "InvestorPaymentStatus" AS ENUM ('PAID', 'UNPAID');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('RUNNING', 'COMPLETED');

-- CreateTable
CREATE TABLE "investor_payments" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "InvestorPaymentStatus" NOT NULL DEFAULT 'PAID',
    "investorName" TEXT NOT NULL,
    "investedAmount" DECIMAL(12,2) NOT NULL,
    "receivedAmount" DECIMAL(12,2) NOT NULL,
    "paymentBy" TEXT NOT NULL,
    "referenceBy" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "investmentStatus" "InvestmentStatus" NOT NULL DEFAULT 'RUNNING',
    "monthsPaid" INTEGER NOT NULL DEFAULT 0,
    "buyProducts" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investor_payments_pkey" PRIMARY KEY ("id")
);
