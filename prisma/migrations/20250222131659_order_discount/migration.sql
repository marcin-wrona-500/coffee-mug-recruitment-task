/*
  Warnings:

  - Added the required column `products_total` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `discount` DECIMAL(10, 2) NULL,
    ADD COLUMN `products_total` DECIMAL(10, 2) UNSIGNED NOT NULL;

-- CreateIndex
CREATE INDEX `Order__Customer__FK_idx` ON `Order`(`id_Customer`);
