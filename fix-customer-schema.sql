-- Add customerNumber and address columns to Customer table
ALTER TABLE `Customer` 
  ADD COLUMN `customerNumber` VARCHAR(191) NOT NULL UNIQUE,
  ADD COLUMN `address` VARCHAR(191) NULL,
  ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  ADD INDEX `Customer_customerNumber_idx`(`customerNumber`),
  ADD INDEX `Customer_email_idx`(`email`);
