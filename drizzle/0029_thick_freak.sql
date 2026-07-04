CREATE TABLE `displayAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`displayId` int NOT NULL,
	`views` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`conversions` int NOT NULL DEFAULT 0,
	`revenue` decimal(12,2) DEFAULT '0',
	`date` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `displayAnalytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `displayManagement` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`displayType` enum('banner','carousel','grid','featured','promotion','custom') NOT NULL,
	`location` varchar(100) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`priority` int NOT NULL DEFAULT 0,
	`startDate` timestamp,
	`endDate` timestamp,
	`backgroundColor` varchar(50),
	`textColor` varchar(50),
	`imageUrl` varchar(500),
	`content` text,
	`targetAudience` varchar(100),
	`analyticsData` text,
	`createdBy` int NOT NULL,
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `displayManagement_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `displayAnalytics` ADD CONSTRAINT `displayAnalytics_displayId_displayManagement_id_fk` FOREIGN KEY (`displayId`) REFERENCES `displayManagement`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `displayManagement` ADD CONSTRAINT `displayManagement_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `displayManagement` ADD CONSTRAINT `displayManagement_updatedBy_users_id_fk` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;