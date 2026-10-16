/*
  Warnings:

  - You are about to drop the column `size` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "size";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "size" TEXT;
