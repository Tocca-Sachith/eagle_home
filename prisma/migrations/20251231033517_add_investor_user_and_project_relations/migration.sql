-- AlterTable
ALTER TABLE `Investor` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'USER' COMMENT 'USER, ADMIN, INVESTOR';

-- CreateTable
CREATE TABLE `ProjectInvestor` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `investorId` VARCHAR(191) NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProjectInvestor_projectId_idx`(`projectId`),
    INDEX `ProjectInvestor_investorId_idx`(`investorId`),
    UNIQUE INDEX `ProjectInvestor_projectId_investorId_key`(`projectId`, `investorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Investor_userId_key` ON `Investor`(`userId`);

-- CreateIndex
CREATE INDEX `Investor_userId_idx` ON `Investor`(`userId`);

-- AddForeignKey
ALTER TABLE `Investor` ADD CONSTRAINT `Investor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectInvestor` ADD CONSTRAINT `ProjectInvestor_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectInvestor` ADD CONSTRAINT `ProjectInvestor_investorId_fkey` FOREIGN KEY (`investorId`) REFERENCES `Investor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
