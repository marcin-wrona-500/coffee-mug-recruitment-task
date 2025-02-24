-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_Customer` INTEGER UNSIGNED NOT NULL,
    `total_items` DECIMAL(7, 0) UNSIGNED NOT NULL,
    `total` DECIMAL(10, 2) UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_Order` INTEGER UNSIGNED NOT NULL,
    `id_Product` INTEGER UNSIGNED NOT NULL,
    `unit_price` DECIMAL(7, 2) UNSIGNED NOT NULL,
    `quantity` DECIMAL(5, 0) UNSIGNED NOT NULL,
    `total` DECIMAL(10, 2) UNSIGNED NOT NULL,

    INDEX `OrderItem__Order__FK_idx`(`id_Order`),
    INDEX `OrderItem__Product__FK_idx`(`id_Product`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem__Order__FK` FOREIGN KEY (`id_Order`) REFERENCES `Order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem__Product__FK` FOREIGN KEY (`id_Product`) REFERENCES `Product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
