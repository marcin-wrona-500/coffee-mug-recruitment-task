-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(50) NOT NULL,
    `price` DECIMAL(7, 2) NOT NULL,
    `stock` DECIMAL(10, 0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
