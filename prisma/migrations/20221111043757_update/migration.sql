/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `users_events` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `payment_details` MODIFY `image` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_events_user_id_key` ON `users_events`(`user_id`);
