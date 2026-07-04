ALTER TABLE `delegateCommissions` MODIFY COLUMN `status` enum('pending','approved','paid','rejected') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `warehouseCommissions` MODIFY COLUMN `status` enum('pending','approved','paid','rejected') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `delegateCommissions` ADD `delegatePhone` varchar(20);--> statement-breakpoint
ALTER TABLE `delegateCommissions` ADD `delegateEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `delegateCommissions` ADD `orderNumber` varchar(50);--> statement-breakpoint
ALTER TABLE `delegateCommissions` ADD `productCount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `delegateCommissions` ADD `paymentDate` timestamp;--> statement-breakpoint
ALTER TABLE `delegateCommissions` ADD `paymentMethod` varchar(50);--> statement-breakpoint
ALTER TABLE `delegateCommissions` ADD `transactionId` varchar(100);--> statement-breakpoint
ALTER TABLE `warehouseCommissions` ADD `warehouseName` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `warehouseCommissions` ADD `orderNumber` varchar(50);--> statement-breakpoint
ALTER TABLE `warehouseCommissions` ADD `productCount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `warehouseCommissions` ADD `paymentDate` timestamp;--> statement-breakpoint
ALTER TABLE `warehouseCommissions` ADD `paymentMethod` varchar(50);--> statement-breakpoint
ALTER TABLE `warehouseCommissions` ADD `transactionId` varchar(100);