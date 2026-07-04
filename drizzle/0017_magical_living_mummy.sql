CREATE TABLE `chatMentions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`mentionedUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMentions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `groupChatMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('admin','moderator','member') NOT NULL DEFAULT 'member',
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`lastReadAt` timestamp NOT NULL DEFAULT (now()),
	`isMuted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `groupChatMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `groupChatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`senderId` int NOT NULL,
	`messageType` enum('text','image','file','emoji','link','system') NOT NULL DEFAULT 'text',
	`content` text NOT NULL,
	`imageUrl` varchar(500),
	`fileUrl` varchar(500),
	`fileName` varchar(255),
	`fileSize` int,
	`emoji` varchar(50),
	`linkUrl` varchar(500),
	`linkTitle` varchar(255),
	`linkDescription` text,
	`linkImage` varchar(500),
	`replyToId` int,
	`isEdited` boolean NOT NULL DEFAULT false,
	`editedAt` timestamp,
	`isDeleted` boolean NOT NULL DEFAULT false,
	`deletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `groupChatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `groupChatRooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(500),
	`createdBy` int NOT NULL,
	`isPublic` boolean NOT NULL DEFAULT true,
	`maxMembers` int NOT NULL DEFAULT 1000,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `groupChatRooms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messageReactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`userId` int NOT NULL,
	`emoji` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messageReactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userStatus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('online','away','busy','offline') NOT NULL DEFAULT 'offline',
	`statusMessage` varchar(255),
	`lastSeenAt` timestamp NOT NULL DEFAULT (now()),
	`isTyping` boolean NOT NULL DEFAULT false,
	`typingRoomId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userStatus_id` PRIMARY KEY(`id`),
	CONSTRAINT `userStatus_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `chatMentions` ADD CONSTRAINT `chatMentions_messageId_groupChatMessages_id_fk` FOREIGN KEY (`messageId`) REFERENCES `groupChatMessages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatMentions` ADD CONSTRAINT `chatMentions_mentionedUserId_users_id_fk` FOREIGN KEY (`mentionedUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupChatMembers` ADD CONSTRAINT `groupChatMembers_roomId_groupChatRooms_id_fk` FOREIGN KEY (`roomId`) REFERENCES `groupChatRooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupChatMembers` ADD CONSTRAINT `groupChatMembers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupChatMessages` ADD CONSTRAINT `groupChatMessages_roomId_groupChatRooms_id_fk` FOREIGN KEY (`roomId`) REFERENCES `groupChatRooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupChatMessages` ADD CONSTRAINT `groupChatMessages_senderId_users_id_fk` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupChatRooms` ADD CONSTRAINT `groupChatRooms_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messageReactions` ADD CONSTRAINT `messageReactions_messageId_groupChatMessages_id_fk` FOREIGN KEY (`messageId`) REFERENCES `groupChatMessages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messageReactions` ADD CONSTRAINT `messageReactions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userStatus` ADD CONSTRAINT `userStatus_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userStatus` ADD CONSTRAINT `userStatus_typingRoomId_groupChatRooms_id_fk` FOREIGN KEY (`typingRoomId`) REFERENCES `groupChatRooms`(`id`) ON DELETE set null ON UPDATE no action;