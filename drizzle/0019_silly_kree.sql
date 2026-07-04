CREATE TABLE `chatFilters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`muteNotifications` boolean NOT NULL DEFAULT false,
	`hideImages` boolean NOT NULL DEFAULT false,
	`hideLinks` boolean NOT NULL DEFAULT false,
	`autoTranslate` boolean NOT NULL DEFAULT false,
	`targetLanguage` varchar(10) DEFAULT 'ar',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatFilters_id` PRIMARY KEY(`id`),
	CONSTRAINT `chatFilters_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `groupChatNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`messageId` int,
	`roomId` int NOT NULL,
	`type` enum('mention','reply','reaction','message') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `groupChatNotifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messageReadStatus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`userId` int NOT NULL,
	`readAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messageReadStatus_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messageSearchIndex` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`roomId` int NOT NULL,
	`searchText` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messageSearchIndex_id` PRIMARY KEY(`id`),
	CONSTRAINT `messageSearchIndex_messageId_unique` UNIQUE(`messageId`)
);
--> statement-breakpoint
CREATE TABLE `pinnedMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`roomId` int NOT NULL,
	`pinnedBy` int NOT NULL,
	`pinnedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pinnedMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roomModerationActions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`moderatorId` int NOT NULL,
	`targetUserId` int,
	`targetMessageId` int,
	`action` enum('mute','unmute','kick','warn','delete_message','pin_message','unpin_message') NOT NULL,
	`reason` text,
	`duration` int,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `roomModerationActions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chatFilters` ADD CONSTRAINT `chatFilters_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupChatNotifications` ADD CONSTRAINT `groupChatNotifications_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupChatNotifications` ADD CONSTRAINT `groupChatNotifications_messageId_groupChatMessages_id_fk` FOREIGN KEY (`messageId`) REFERENCES `groupChatMessages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupChatNotifications` ADD CONSTRAINT `groupChatNotifications_roomId_groupChatRooms_id_fk` FOREIGN KEY (`roomId`) REFERENCES `groupChatRooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messageReadStatus` ADD CONSTRAINT `messageReadStatus_messageId_groupChatMessages_id_fk` FOREIGN KEY (`messageId`) REFERENCES `groupChatMessages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messageReadStatus` ADD CONSTRAINT `messageReadStatus_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messageSearchIndex` ADD CONSTRAINT `messageSearchIndex_messageId_groupChatMessages_id_fk` FOREIGN KEY (`messageId`) REFERENCES `groupChatMessages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messageSearchIndex` ADD CONSTRAINT `messageSearchIndex_roomId_groupChatRooms_id_fk` FOREIGN KEY (`roomId`) REFERENCES `groupChatRooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pinnedMessages` ADD CONSTRAINT `pinnedMessages_messageId_groupChatMessages_id_fk` FOREIGN KEY (`messageId`) REFERENCES `groupChatMessages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pinnedMessages` ADD CONSTRAINT `pinnedMessages_roomId_groupChatRooms_id_fk` FOREIGN KEY (`roomId`) REFERENCES `groupChatRooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pinnedMessages` ADD CONSTRAINT `pinnedMessages_pinnedBy_users_id_fk` FOREIGN KEY (`pinnedBy`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roomModerationActions` ADD CONSTRAINT `roomModerationActions_roomId_groupChatRooms_id_fk` FOREIGN KEY (`roomId`) REFERENCES `groupChatRooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roomModerationActions` ADD CONSTRAINT `roomModerationActions_moderatorId_users_id_fk` FOREIGN KEY (`moderatorId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roomModerationActions` ADD CONSTRAINT `roomModerationActions_targetUserId_users_id_fk` FOREIGN KEY (`targetUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roomModerationActions` ADD CONSTRAINT `roomModerationActions_targetMessageId_groupChatMessages_id_fk` FOREIGN KEY (`targetMessageId`) REFERENCES `groupChatMessages`(`id`) ON DELETE cascade ON UPDATE no action;