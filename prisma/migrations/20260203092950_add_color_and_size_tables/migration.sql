-- CreateEnum
CREATE TYPE "SizeType" AS ENUM ('CLOTHING_NUMBER', 'CLOTHING_TEXT', 'SHOE', 'GLOVE', 'STANDARD');

-- AlterTable
ALTER TABLE "cartitem" ADD COLUMN     "colorId" INTEGER,
ADD COLUMN     "sizeId" INTEGER,
ADD COLUMN     "variantId" INTEGER;

-- AlterTable
ALTER TABLE "orderitem" ADD COLUMN     "colorId" INTEGER,
ADD COLUMN     "sizeId" INTEGER,
ADD COLUMN     "variantId" INTEGER;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "hasVariants" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sizeType" "SizeType";

-- CreateTable
CREATE TABLE "color" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hexCode" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "size" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "type" "SizeType" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,
    "sizeId" INTEGER,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "priceModifier" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "color_name_key" ON "color"("name");

-- CreateIndex
CREATE UNIQUE INDEX "size_value_type_key" ON "size"("value", "type");

-- CreateIndex
CREATE INDEX "product_variant_productId_idx" ON "product_variant"("productId");

-- CreateIndex
CREATE INDEX "product_variant_colorId_idx" ON "product_variant"("colorId");

-- CreateIndex
CREATE INDEX "product_variant_sizeId_idx" ON "product_variant"("sizeId");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_productId_colorId_sizeId_key" ON "product_variant"("productId", "colorId", "sizeId");

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "size"("id") ON DELETE CASCADE ON UPDATE CASCADE;
