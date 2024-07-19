/*
  Warnings:

  - You are about to drop the column `isPrivateEntity` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `isPrivateEntity`,
    ADD COLUMN `ownBusiness` BOOLEAN NULL DEFAULT false;
