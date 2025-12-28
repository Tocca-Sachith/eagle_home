-- AlterTable: Add new columns to Project table
ALTER TABLE `Project` 
  ADD COLUMN `description` TEXT NULL,
  ADD COLUMN `actualCost` DOUBLE NULL,
  ADD COLUMN `contractDate` DATETIME(3) NULL,
  ADD COLUMN `actualEndDate` DATETIME(3) NULL,
  ADD COLUMN `investorName` VARCHAR(191) NULL,
  ADD COLUMN `investorContact` VARCHAR(191) NULL,
  ADD COLUMN `thumbnailImage` VARCHAR(191) NULL,
  ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `displayOrder` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `progressPercent` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `currentPhase` VARCHAR(191) NULL,
  ADD COLUMN `notes` TEXT NULL,
  ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- CreateTable: ProjectImage
CREATE TABLE `ProjectImage` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `imagePath` VARCHAR(191) NOT NULL,
    `caption` VARCHAR(191) NULL,
    `phase` VARCHAR(191) NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProjectImage_projectId_idx`(`projectId`),
    INDEX `ProjectImage_displayOrder_idx`(`displayOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Project_isPublished_idx` ON `Project`(`isPublished`);

-- CreateIndex
CREATE INDEX `Project_displayOrder_idx` ON `Project`(`displayOrder`);

-- AddForeignKey
ALTER TABLE `ProjectImage` ADD CONSTRAINT `ProjectImage_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
