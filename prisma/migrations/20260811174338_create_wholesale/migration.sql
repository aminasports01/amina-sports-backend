-- CreateEnum
CREATE TYPE "WholesaleStatus" AS ENUM ('PAID', 'UNPAID');

-- CreateTable
CREATE TABLE "wholesale-records" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "WholesaleStatus" NOT NULL DEFAULT 'UNPAID',
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceRmb" DECIMAL(12,2) NOT NULL,
    "priceTaka" DECIMAL(12,2) NOT NULL,
    "weight" DECIMAL(12,2) NOT NULL,
    "costPerKg" DECIMAL(12,2) NOT NULL,
    "shipping" DECIMAL(12,2) NOT NULL,
    "courierChina" TEXT,
    "note" TEXT,
    "onePairPrice" DECIMAL(12,2) NOT NULL,
    "salePrice" DECIMAL(12,2) NOT NULL,
    "loss" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "profit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wholesale-records_pkey" PRIMARY KEY ("id")
);
