/*
  Warnings:

  - You are about to drop the column `createdAt` on the `joblisting` table. All the data in the column will be lost.
  - You are about to drop the column `employerId` on the `joblisting` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `deadline` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `team` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `analytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `employer_id` to the `JobListing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `JobListing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employer_id` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `analytics` DROP FOREIGN KEY `Analytics_userId_fkey`;

-- DropForeignKey
ALTER TABLE `joblisting` DROP FOREIGN KEY `JobListing_employerId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_teamId_fkey`;

-- AlterTable
ALTER TABLE `joblisting` DROP COLUMN `createdAt`,
    DROP COLUMN `employerId`,
    ADD COLUMN `employer_id` INTEGER NOT NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `project` DROP COLUMN `createdAt`,
    DROP COLUMN `deadline`,
    DROP COLUMN `teamId`,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `team_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `team` DROP COLUMN `createdAt`,
    ADD COLUMN `employer_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `createdAt`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `analytics`;

-- DropTable
DROP TABLE `message`;

-- DropTable
DROP TABLE `notification`;

-- CreateTable
CREATE TABLE `Profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `resume` VARCHAR(191) NULL,
    `experience` VARCHAR(191) NULL,

    UNIQUE INDEX `Profile_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Application` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `job_id` INTEGER NOT NULL,
    `job_seeker_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `applied_on` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NOT NULL,
    `assigned_to` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `due_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobListing` ADD CONSTRAINT `JobListing_employer_id_fkey` FOREIGN KEY (`employer_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `JobListing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_employer_id_fkey` FOREIGN KEY (`employer_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
