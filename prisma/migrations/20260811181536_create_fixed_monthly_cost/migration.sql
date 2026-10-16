-- CreateEnum
CREATE TYPE "FixedMonthlyCostStatus" AS ENUM ('PAID', 'UNPAID');

-- CreateTable
CREATE TABLE "fixed_monthly_costs" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "FixedMonthlyCostStatus" NOT NULL DEFAULT 'UNPAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fixed_monthly_costs_pkey" PRIMARY KEY ("id")
);
