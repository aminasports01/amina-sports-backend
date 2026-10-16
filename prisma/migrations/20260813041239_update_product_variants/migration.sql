-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "dangerousGoods" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dimensions" JSONB,
ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "material" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "specialPrice" DOUBLE PRECISION,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "warrantyPeriod" TEXT,
ADD COLUMN     "warrantyType" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION,
ALTER COLUMN "images" SET DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "ProductColorVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductColorVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSizeVariant" (
    "id" TEXT NOT NULL,
    "colorVariantId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "specialPrice" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSizeVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductSizeVariant_colorVariantId_size_key" ON "ProductSizeVariant"("colorVariantId", "size");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSizeVariant_sku_key" ON "ProductSizeVariant"("sku");

-- AddForeignKey
ALTER TABLE "ProductColorVariant" ADD CONSTRAINT "ProductColorVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSizeVariant" ADD CONSTRAINT "ProductSizeVariant_colorVariantId_fkey" FOREIGN KEY ("colorVariantId") REFERENCES "ProductColorVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
