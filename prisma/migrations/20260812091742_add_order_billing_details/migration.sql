/*
  Warnings:

  - Added the required column `district` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thana` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "thana" TEXT NOT NULL;
