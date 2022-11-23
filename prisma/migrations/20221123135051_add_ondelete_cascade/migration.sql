-- DropForeignKey
ALTER TABLE `paket` DROP FOREIGN KEY `paket_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_details` DROP FOREIGN KEY `payment_details_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `schedules` DROP FOREIGN KEY `schedules_event_id_fkey`;

-- AddForeignKey
ALTER TABLE `paket` ADD CONSTRAINT `paket_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_details` ADD CONSTRAINT `payment_details_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
