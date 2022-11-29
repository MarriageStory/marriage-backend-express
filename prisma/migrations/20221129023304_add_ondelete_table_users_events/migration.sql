-- DropForeignKey
ALTER TABLE `users_events` DROP FOREIGN KEY `users_events_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `users_events` DROP FOREIGN KEY `users_events_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `users_events` ADD CONSTRAINT `users_events_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_events` ADD CONSTRAINT `users_events_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
