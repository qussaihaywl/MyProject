CREATE TABLE `couponUsage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`couponId` int NOT NULL,
	`userId` int NOT NULL,
	`orderId` int NOT NULL,
	`discountAmount` decimal(10,2) NOT NULL,
	`usedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `couponUsage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discountCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`discountType` enum('percentage','fixed') NOT NULL,
	`discountValue` decimal(10,2) NOT NULL,
	`minOrderAmount` decimal(10,2) DEFAULT '0',
	`maxDiscount` decimal(10,2),
	`usageLimit` int,
	`usagePerUser` int DEFAULT 1,
	`usageCount` int NOT NULL DEFAULT 0,
	`applicableCategories` text,
	`applicableProducts` text,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discountCodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `discountCodes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `loyaltyPoints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalPoints` int NOT NULL DEFAULT 0,
	`usedPoints` int NOT NULL DEFAULT 0,
	`availablePoints` int NOT NULL DEFAULT 0,
	`tier` enum('bronze','silver','gold','platinum') NOT NULL DEFAULT 'bronze',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loyaltyPoints_id` PRIMARY KEY(`id`),
	CONSTRAINT `loyaltyPoints_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('order','promotion','review','message','system','payment') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`actionUrl` varchar(500),
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pointsTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderId` int,
	`transactionType` enum('earned','redeemed','expired','adjusted') NOT NULL,
	`points` int NOT NULL,
	`reason` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pointsTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`userId` int NOT NULL,
	`orderId` int,
	`rating` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`content` text NOT NULL,
	`isVerifiedPurchase` boolean NOT NULL DEFAULT false,
	`helpfulCount` int NOT NULL DEFAULT 0,
	`unhelpfulCount` int NOT NULL DEFAULT 0,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productReviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`userId` int,
	`sessionId` varchar(255),
	`viewDuration` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviewImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reviewId` int NOT NULL,
	`imageUrl` varchar(500) NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviewImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salesAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`totalOrders` int NOT NULL DEFAULT 0,
	`totalRevenue` decimal(15,2) NOT NULL DEFAULT '0',
	`totalItems` int NOT NULL DEFAULT 0,
	`averageOrderValue` decimal(10,2) NOT NULL DEFAULT '0',
	`newCustomers` int NOT NULL DEFAULT 0,
	`returningCustomers` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `salesAnalytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `smsLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`phoneNumber` varchar(20) NOT NULL,
	`message` text NOT NULL,
	`type` varchar(50) NOT NULL,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `smsLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userActivityLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`activityType` varchar(100) NOT NULL,
	`description` text,
	`metadata` text,
	`ipAddress` varchar(50),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userActivityLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `aiConversationContext` DROP FOREIGN KEY `aiConversationContext_roomId_groupChatRooms_id_fk`;
--> statement-breakpoint
ALTER TABLE `aiConversationContext` DROP FOREIGN KEY `aiConversationContext_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `aiResponses` DROP FOREIGN KEY `aiResponses_messageId_groupChatMessages_id_fk`;
--> statement-breakpoint
ALTER TABLE `aiResponses` DROP FOREIGN KEY `aiResponses_trainingDataId_aiTrainingData_id_fk`;
--> statement-breakpoint
ALTER TABLE `aiSettings` DROP FOREIGN KEY `aiSettings_roomId_groupChatRooms_id_fk`;
--> statement-breakpoint
ALTER TABLE `aiTrainingData` DROP FOREIGN KEY `aiTrainingData_adminId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `chatAttachments` DROP FOREIGN KEY `chatAttachments_messageId_chatMessages_id_fk`;
--> statement-breakpoint
ALTER TABLE `chatConversations` DROP FOREIGN KEY `chatConversations_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `chatConversations` DROP FOREIGN KEY `chatConversations_adminId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `chatFilters` DROP FOREIGN KEY `chatFilters_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `chatMentions` DROP FOREIGN KEY `chatMentions_messageId_groupChatMessages_id_fk`;
--> statement-breakpoint
ALTER TABLE `chatMentions` DROP FOREIGN KEY `chatMentions_mentionedUserId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `chatMessages` DROP FOREIGN KEY `chatMessages_conversationId_chatConversations_id_fk`;
--> statement-breakpoint
ALTER TABLE `chatMessages` DROP FOREIGN KEY `chatMessages_senderId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `chatNotifications` DROP FOREIGN KEY `chatNotifications_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `chatNotifications` DROP FOREIGN KEY `chatNotifications_conversationId_chatConversations_id_fk`;
--> statement-breakpoint
ALTER TABLE `chatNotifications` DROP FOREIGN KEY `chatNotifications_messageId_chatMessages_id_fk`;
--> statement-breakpoint
ALTER TABLE `groupChatMembers` DROP FOREIGN KEY `groupChatMembers_roomId_groupChatRooms_id_fk`;
--> statement-breakpoint
ALTER TABLE `groupChatMembers` DROP FOREIGN KEY `groupChatMembers_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `groupChatMessages` DROP FOREIGN KEY `groupChatMessages_roomId_groupChatRooms_id_fk`;
--> statement-breakpoint
ALTER TABLE `groupChatMessages` DROP FOREIGN KEY `groupChatMessages_senderId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `groupChatNotifications` DROP FOREIGN KEY `groupChatNotifications_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `groupChatNotifications` DROP FOREIGN KEY `groupChatNotifications_messageId_groupChatMessages_id_fk`;
--> statement-breakpoint
ALTER TABLE `groupChatNotifications` DROP FOREIGN KEY `groupChatNotifications_roomId_groupChatRooms_id_fk`;
--> statement-breakpoint
ALTER TABLE `groupChatRooms` DROP FOREIGN KEY `groupChatRooms_createdBy_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `messageReactions` DROP FOREIGN KEY `messageReactions_messageId_groupChatMessages_id_fk`;
--> statement-breakpoint
ALTER TABLE `messageReactions` DROP FOREIGN KEY `messageReactions_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `messageReadStatus` DROP FOREIGN KEY `messageReadStatus_messageId_groupChatMessages_id_fk`;
--> statement-breakpoint
ALTER TABLE `messageReadStatus` DROP FOREIGN KEY `messageReadStatus_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `messageSearchIndex` DROP FOREIGN KEY `messageSearchIndex_messageId_groupChatMessages_id_fk`;
--> statement-breakpoint
ALTER TABLE `messageSearchIndex` DROP FOREIGN KEY `messageSearchIndex_roomId_groupChatRooms_id_fk`;
--> statement-breakpoint
ALTER TABLE `pinnedMessages` DROP FOREIGN KEY `pinnedMessages_messageId_groupChatMessages_id_fk`;
--> statement-breakpoint
ALTER TABLE `pinnedMessages` DROP FOREIGN KEY `pinnedMessages_roomId_groupChatRooms_id_fk`;
--> statement-breakpoint
ALTER TABLE `pinnedMessages` DROP FOREIGN KEY `pinnedMessages_pinnedBy_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `roomModerationActions` DROP FOREIGN KEY `roomModerationActions_roomId_groupChatRooms_id_fk`;
--> statement-breakpoint
ALTER TABLE `roomModerationActions` DROP FOREIGN KEY `roomModerationActions_moderatorId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `roomModerationActions` DROP FOREIGN KEY `roomModerationActions_targetUserId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `roomModerationActions` DROP FOREIGN KEY `roomModerationActions_targetMessageId_groupChatMessages_id_fk`;
--> statement-breakpoint
ALTER TABLE `userFavorites` DROP FOREIGN KEY `userFavorites_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `userFavorites` DROP FOREIGN KEY `userFavorites_productId_products_id_fk`;
--> statement-breakpoint
ALTER TABLE `userOnlineStatus` DROP FOREIGN KEY `userOnlineStatus_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `userStatus` DROP FOREIGN KEY `userStatus_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `userStatus` DROP FOREIGN KEY `userStatus_typingRoomId_groupChatRooms_id_fk`;
--> statement-breakpoint
ALTER TABLE `products` ADD `originalPrice` decimal(10,2);--> statement-breakpoint
ALTER TABLE `products` ADD `discount` decimal(5,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `products` ADD `lowStockThreshold` int DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `sku` varchar(100);--> statement-breakpoint
ALTER TABLE `products` ADD `barcode` varchar(100);--> statement-breakpoint
ALTER TABLE `products` ADD `isFeatured` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `averageRating` decimal(3,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `products` ADD `totalReviews` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_sku_unique` UNIQUE(`sku`);--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_barcode_unique` UNIQUE(`barcode`);