-- CreateEnum
CREATE TYPE "SteadfastWithdrawalStatus" AS ENUM ('PAID', 'UNPAID');

-- CreateEnum
CREATE TYPE "SteadfastWithdrawalClearanceStatus" AS ENUM ('COMPLETED', 'PENDING');

-- CreateTable
CREATE TABLE "steadfast_withdrawals" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "SteadfastWithdrawalStatus" NOT NULL DEFAULT 'PAID',
    "withdrawBy" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "clearanceStatus" "SteadfastWithdrawalClearanceStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "steadfast_withdrawals_pkey" PRIMARY KEY ("id")
);
