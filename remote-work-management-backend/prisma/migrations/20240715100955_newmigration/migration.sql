-- AlterTable
ALTER TABLE `notification` ADD COLUMN `applicationId` INTEGER NULL;

-- AlterTable
ALTER TABLE `task` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'open';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `company` VARCHAR(191) NULL,
    ADD COLUMN `isPrivateEntity` BOOLEAN NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
