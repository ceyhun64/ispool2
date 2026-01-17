/*
  Warnings:

  - You are about to drop the column `categoryId` on the `sub_category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,middleCategoryId]` on the table `sub_category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `middleCategoryId` to the `sub_category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sub_category" DROP CONSTRAINT "sub_category_categoryId_fkey";

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "middleCategoryId" INTEGER,
ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "reviewCount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "sub_category" DROP COLUMN "categoryId",
ADD COLUMN     "middleCategoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "middle_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "middle_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "middle_category_name_categoryId_key" ON "middle_category"("name", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sub_category_name_middleCategoryId_key" ON "sub_category"("name", "middleCategoryId");

-- AddForeignKey
ALTER TABLE "middle_category" ADD CONSTRAINT "middle_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_category" ADD CONSTRAINT "sub_category_middleCategoryId_fkey" FOREIGN KEY ("middleCategoryId") REFERENCES "middle_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_middleCategoryId_fkey" FOREIGN KEY ("middleCategoryId") REFERENCES "middle_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
