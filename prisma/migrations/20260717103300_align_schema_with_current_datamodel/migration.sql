-- DropForeignKey
ALTER TABLE "product_variant" DROP CONSTRAINT "product_variant_colorId_fkey";

-- DropForeignKey
ALTER TABLE "product_variant" DROP CONSTRAINT "product_variant_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_variant" DROP CONSTRAINT "product_variant_sizeId_fkey";

-- DropIndex
DROP INDEX "size_value_type_key";

-- AlterTable
ALTER TABLE "cartitem" DROP COLUMN "colorId",
DROP COLUMN "variantId";

-- AlterTable
ALTER TABLE "color" DROP COLUMN "image",
DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "orderaddress" ADD COLUMN     "billingType" VARCHAR(20);

-- AlterTable
ALTER TABLE "orderitem" DROP COLUMN "colorId",
DROP COLUMN "variantId";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "hasVariants",
DROP COLUMN "sizeType",
ADD COLUMN     "bulkDiscountQty" INTEGER DEFAULT 0,
ADD COLUMN     "bulkDiscountRate" INTEGER DEFAULT 0,
ADD COLUMN     "colorId" INTEGER,
ADD COLUMN     "productGroupId" TEXT,
ADD COLUMN     "showVideo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "size" DROP COLUMN "type";

-- DropTable
DROP TABLE "Banner";

-- DropTable
DROP TABLE "product_variant";

-- DropEnum
DROP TYPE "SizeType";

-- CreateTable
CREATE TABLE "product_size" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "sizeId" INTEGER NOT NULL,

    CONSTRAINT "product_size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_stock" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "sizeId" INTEGER,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "priceModifier" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "image" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_slide" (
    "id" SERIAL NOT NULL,
    "tag" TEXT,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "desktopImage" TEXT NOT NULL,
    "mobileImage" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_slide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_size_productId_sizeId_key" ON "product_size"("productId", "sizeId");

-- CreateIndex
CREATE INDEX "product_stock_productId_idx" ON "product_stock"("productId");

-- CreateIndex
CREATE INDEX "product_stock_sizeId_idx" ON "product_stock"("sizeId");

-- CreateIndex
CREATE UNIQUE INDEX "product_stock_productId_sizeId_key" ON "product_stock"("productId", "sizeId");

-- CreateIndex
CREATE INDEX "CartItem_userId_fkey" ON "cartitem"("userId");

-- CreateIndex
CREATE INDEX "CartItem_sizeId_fkey" ON "cartitem"("sizeId");

-- CreateIndex
CREATE INDEX "OrderItem_sizeId_fkey" ON "orderitem"("sizeId");

-- CreateIndex
CREATE INDEX "product_categoryId_idx" ON "product"("categoryId");

-- CreateIndex
CREATE INDEX "product_middleCategoryId_idx" ON "product"("middleCategoryId");

-- CreateIndex
CREATE INDEX "product_subCategoryId_idx" ON "product"("subCategoryId");

-- CreateIndex
CREATE INDEX "product_brandId_idx" ON "product"("brandId");

-- CreateIndex
CREATE INDEX "product_colorId_idx" ON "product"("colorId");

-- CreateIndex
CREATE UNIQUE INDEX "size_value_key" ON "size"("value");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "color"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_size" ADD CONSTRAINT "product_size_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_size" ADD CONSTRAINT "product_size_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "size"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_stock" ADD CONSTRAINT "product_stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartitem" ADD CONSTRAINT "cartitem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartitem" ADD CONSTRAINT "cartitem_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "size"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderitem" ADD CONSTRAINT "orderitem_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "size"("id") ON DELETE SET NULL ON UPDATE CASCADE;

