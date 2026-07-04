CREATE TABLE `chatAttachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`attachmentType` enum('image','document','video','audio') NOT NULL,
	`attachmentUrl` varchar(500) NOT NULL,
	`attachmentName` varchar(255) NOT NULL,
	`attachmentSize` int NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatAttachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatConversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`adminId` int,
	`subject` varchar(255) NOT NULL,
	`status` enum('open','closed','pending','resolved') NOT NULL DEFAULT 'open',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`lastMessageAt` timestamp NOT NULL DEFAULT (now()),
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatConversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`senderId` int NOT NULL,
	`messageType` enum('text','image','file','link') NOT NULL DEFAULT 'text',
	`content` text NOT NULL,
	`imageUrl` varchar(500),
	`fileUrl` varchar(500),
	`fileName` varchar(255),
	`fileSize` int,
	`linkUrl` varchar(500),
	`linkTitle` varchar(255),
	`isRead` boolean NOT NULL DEFAULT false,
	`isEdited` boolean NOT NULL DEFAULT false,
	`editedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`conversationId` int NOT NULL,
	`messageId` int NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`notificationType` enum('new_message','mention','status_change') NOT NULL DEFAULT 'new_message',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatNotifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userOnlineStatus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`isOnline` boolean NOT NULL DEFAULT false,
	`lastSeenAt` timestamp NOT NULL DEFAULT (now()),
	`statusMessage` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userOnlineStatus_id` PRIMARY KEY(`id`),
	CONSTRAINT `userOnlineStatus_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
DROP TABLE `advancedOrdersEnhanced`;--> statement-breakpoint
ALTER TABLE `inquiries` MODIFY COLUMN `status` enum('new','read','replied','closed') NOT NULL DEFAULT 'new';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','agent','delegate','warehouse_manager','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `advancedOrders` ADD `orderNumber` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `advancedOrders` ADD `productId` int;--> statement-breakpoint
ALTER TABLE `advancedOrders` ADD `categoryId` int;--> statement-breakpoint
ALTER TABLE `advancedOrders` ADD `customerId` int;--> statement-breakpoint
ALTER TABLE `advancedOrders` ADD `customerEmail` varchar(100);--> statement-breakpoint
ALTER TABLE `advancedOrders` ADD `delegateId` int;--> statement-breakpoint
ALTER TABLE `advancedOrders` ADD `warehouseId` int;--> statement-breakpoint
ALTER TABLE `advancedOrders` ADD `paymentStatus` enum('unpaid','partial','paid') DEFAULT 'unpaid' NOT NULL;--> statement-breakpoint
ALTER TABLE `advancedOrders` ADD `shippingCost` decimal(10,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `advancedOrders` ADD `totalAmount` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `delegateCommissions` ADD `delegateId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `warehouseCommissions` ADD `warehouseId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `warehouses` ADD `location` varchar(200);--> statement-breakpoint
ALTER TABLE `warehouses` ADD `managerId` int;--> statement-breakpoint
ALTER TABLE `advancedOrders` ADD CONSTRAINT `advancedOrders_orderNumber_unique` UNIQUE(`orderNumber`);--> statement-breakpoint
ALTER TABLE `chatAttachments` ADD CONSTRAINT `chatAttachments_messageId_chatMessages_id_fk` FOREIGN KEY (`messageId`) REFERENCES `chatMessages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatConversations` ADD CONSTRAINT `chatConversations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatConversations` ADD CONSTRAINT `chatConversations_adminId_users_id_fk` FOREIGN KEY (`adminId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatMessages` ADD CONSTRAINT `chatMessages_conversationId_chatConversations_id_fk` FOREIGN KEY (`conversationId`) REFERENCES `chatConversations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatMessages` ADD CONSTRAINT `chatMessages_senderId_users_id_fk` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatNotifications` ADD CONSTRAINT `chatNotifications_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatNotifications` ADD CONSTRAINT `chatNotifications_conversationId_chatConversations_id_fk` FOREIGN KEY (`conversationId`) REFERENCES `chatConversations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatNotifications` ADD CONSTRAINT `chatNotifications_messageId_chatMessages_id_fk` FOREIGN KEY (`messageId`) REFERENCES `chatMessages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userOnlineStatus` ADD CONSTRAINT `userOnlineStatus_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;