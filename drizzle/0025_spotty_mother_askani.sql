CREATE TABLE `productExtractionLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`extractedText` text,
	`confidence` decimal(3,2),
	`suggestedCategory` varchar(255),
	`suggestedPrice` decimal(10,2),
	`status` enum('pending','approved','rejected','manual_review') NOT NULL DEFAULT 'pending',
	`reviewedBy` int,
	`reviewNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	CONSTRAINT `productExtractionLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `whatsappGroups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupName` varchar(255) NOT NULL,
	`groupId` varchar(255) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsappGroups_id` PRIMARY KEY(`id`),
	CONSTRAINT `whatsappGroups_groupId_unique` UNIQUE(`groupId`)
);
--> statement-breakpoint
CREATE TABLE `whatsappMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`messageId` varchar(255) NOT NULL,
	`senderName` varchar(255) NOT NULL,
	`senderPhone` varchar(20) NOT NULL,
	`messageText` text,
	`imageUrl` text,
	`mediaType` varchar(50),
	`isProcessed` boolean NOT NULL DEFAULT false,
	`productId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`processedAt` timestamp,
	CONSTRAINT `whatsappMessages_id` PRIMARY KEY(`id`),
	CONSTRAINT `whatsappMessages_messageId_unique` UNIQUE(`messageId`)
);
--> statement-breakpoint
CREATE TABLE `whatsappProductMappings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`productId` int NOT NULL,
	`categoryId` int NOT NULL,
	`mappingConfidence` decimal(3,2),
	`isManualMapping` boolean NOT NULL DEFAULT false,
	`mappedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `whatsappProductMappings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `whatsappSyncConfig` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessPhoneNumber` varchar(20) NOT NULL,
	`accessToken` varchar(500) NOT NULL,
	`webhookUrl` text,
	`webhookVerifyToken` varchar(255),
	`isEnabled` boolean NOT NULL DEFAULT true,
	`autoPublishProducts` boolean NOT NULL DEFAULT false,
	`requireManualApproval` boolean NOT NULL DEFAULT true,
	`lastSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsappSyncConfig_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `productExtractionLogs` ADD CONSTRAINT `productExtractionLogs_messageId_whatsappMessages_id_fk` FOREIGN KEY (`messageId`) REFERENCES `whatsappMessages`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `whatsappMessages` ADD CONSTRAINT `whatsappMessages_groupId_whatsappGroups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `whatsappGroups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `whatsappProductMappings` ADD CONSTRAINT `whatsappProductMappings_messageId_whatsappMessages_id_fk` FOREIGN KEY (`messageId`) REFERENCES `whatsappMessages`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `whatsappProductMappings` ADD CONSTRAINT `whatsappProductMappings_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `whatsappProductMappings` ADD CONSTRAINT `whatsappProductMappings_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;