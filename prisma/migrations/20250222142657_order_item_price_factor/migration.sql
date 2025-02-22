/*
  Warnings:

  - Added the required column `adjusted_price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `adjusted_price` DECIMAL(7, 2) UNSIGNED NOT NULL,
    ADD COLUMN `price_factor` DECIMAL(5, 2) UNSIGNED NOT NULL DEFAULT 1.00;
