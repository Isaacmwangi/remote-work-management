/*
  Warnings:

  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `resume` VARCHAR(191) NULL,
    MODIFY `role` VARCHAR(191) NOT NULL;
