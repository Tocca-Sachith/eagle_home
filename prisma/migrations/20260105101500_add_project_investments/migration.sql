-- Create ProjectInvestment table for multiple investor installments per project
CREATE TABLE `ProjectInvestment` (
  `id` VARCHAR(191) NOT NULL,
  `projectId` VARCHAR(191) NOT NULL,
  `investorId` VARCHAR(191) NOT NULL,
  `installmentNo` INT NOT NULL,
  `amount` DOUBLE NOT NULL,
  `paidAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `ProjectInvestment_projectId_investorId_installmentNo_key` (`projectId`, `investorId`, `installmentNo`),
  INDEX `ProjectInvestment_projectId_idx` (`projectId`),
  INDEX `ProjectInvestment_investorId_idx` (`investorId`),
  INDEX `ProjectInvestment_paidAt_idx` (`paidAt`),

  PRIMARY KEY (`id`),
  CONSTRAINT `ProjectInvestment_projectId_fkey`
    FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ProjectInvestment_investorId_fkey`
    FOREIGN KEY (`investorId`) REFERENCES `Investor`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

