/*
  Warnings:

  - You are about to drop the column `size` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "size";
