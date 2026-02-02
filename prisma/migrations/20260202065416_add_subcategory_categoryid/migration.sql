/*
  Warnings:

  - Added the required column `categoryId` to the `sub_category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sub_category" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "sub_category_categoryId_idx" ON "sub_category"("categoryId");

-- AddForeignKey
ALTER TABLE "sub_category" ADD CONSTRAINT "sub_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
