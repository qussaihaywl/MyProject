CREATE TABLE `delegateCommissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`delegateName` varchar(100) NOT NULL,
	`orderId` int,
	`commissionType` enum('percentage','fixed') NOT NULL DEFAULT 'fixed',
	`commissionRate` decimal(10,2) NOT NULL,
	`totalOrderAmount` decimal(10,2) NOT NULL,
	`commissionAmount` decimal(10,2) NOT NULL,
	`status` enum('pending','approved','paid') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `delegateCommissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `warehouseCommissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`warehouseCode` varchar(50) NOT NULL,
	`orderId` int,
	`commissionType` enum('percentage','fixed') NOT NULL DEFAULT 'percentage',
	`commissionRate` decimal(10,2) NOT NULL,
	`totalOrderAmount` decimal(10,2) NOT NULL,
	`commissionAmount` decimal(10,2) NOT NULL,
	`status` enum('pending','approved','paid') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `warehouseCommissions_id` PRIMARY KEY(`id`)
);
