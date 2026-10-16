-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PAID', 'UNPAID');

-- CreateEnum
CREATE TYPE "ShippingStatus" AS ENUM ('PROCESSING', 'COMPLETED');

-- CreateTable
CREATE TABLE "shipment-records" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "ShipmentStatus" NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "shippingCompany" TEXT NOT NULL,
    "weight" DECIMAL(10,2) NOT NULL,
    "perKgRate" DECIMAL(10,2) NOT NULL,
    "shippingCharge" DECIMAL(12,2) NOT NULL,
    "billingStatus" "ShipmentStatus" NOT NULL,
    "shippingStatus" "ShippingStatus" NOT NULL,
    "receivingDate" TIMESTAMP(3),
    "investorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipment-records_pkey" PRIMARY KEY ("id")
);
