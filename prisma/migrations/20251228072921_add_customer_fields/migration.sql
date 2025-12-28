-- AlterTable
ALTER TABLE `Customer` ADD COLUMN `customerNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Customer_customerNumber_key` ON `Customer`(`customerNumber`);

-- CreateIndex
CREATE INDEX `Customer_customerNumber_idx` ON `Customer`(`customerNumber`);

-- CreateIndex
CREATE INDEX `Customer_email_idx` ON `Customer`(`email`);
