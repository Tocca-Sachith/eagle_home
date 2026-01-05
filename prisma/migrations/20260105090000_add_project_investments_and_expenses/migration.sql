-- Add investment amount per investor per project
ALTER TABLE `ProjectInvestor`
  ADD COLUMN `investmentAmount` DOUBLE NULL;

-- Create project expense table (phase/category/item based costs)
CREATE TABLE `ProjectExpense` (
  `id` VARCHAR(191) NOT NULL,
  `projectId` VARCHAR(191) NOT NULL,
  `phase` VARCHAR(191) NULL,
  `category` VARCHAR(191) NULL,
  `item` VARCHAR(191) NOT NULL,
  `amount` DOUBLE NOT NULL,
  `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
  `expenseDate` DATETIME(3) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  INDEX `ProjectExpense_projectId_idx` (`projectId`),
  INDEX `ProjectExpense_phase_idx` (`phase`),
  INDEX `ProjectExpense_expenseDate_idx` (`expenseDate`),

  PRIMARY KEY (`id`),
  CONSTRAINT `ProjectExpense_projectId_fkey`
    FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

