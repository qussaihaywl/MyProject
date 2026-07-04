ALTER TABLE `users` MODIFY COLUMN `role` enum('user','agent','supervisor','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `permissions` text;--> statement-breakpoint
ALTER TABLE `users` ADD `status` enum('active','inactive','suspended','pending') DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastActivityAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `notes` text;