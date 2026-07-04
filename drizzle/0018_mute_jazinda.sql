CREATE TABLE `aiConversationContext` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`userId` int NOT NULL,
	`topic` varchar(255),
	`context` text,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiConversationContext_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aiResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`trainingDataId` int,
	`response` text NOT NULL,
	`confidence` decimal(3,2) DEFAULT '0.00',
	`isHelpful` boolean,
	`userFeedback` text,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aiSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`aiEnabled` boolean NOT NULL DEFAULT true,
	`aiName` varchar(100) DEFAULT 'روز الذكية',
	`aiPersonality` text,
	`responseStyle` varchar(50) DEFAULT 'friendly',
	`dialect` varchar(50) DEFAULT 'egyptian',
	`learningEnabled` boolean NOT NULL DEFAULT true,
	`autoRespondEnabled` boolean NOT NULL DEFAULT false,
	`responseDelay` int DEFAULT 1000,
	`maxResponseLength` int DEFAULT 500,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `aiSettings_roomId_unique` UNIQUE(`roomId`)
);
--> statement-breakpoint
CREATE TABLE `aiTrainingData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`userQuery` text NOT NULL,
	`adminResponse` text NOT NULL,
	`category` varchar(100),
	`dialect` varchar(50) DEFAULT 'egyptian',
	`confidence` decimal(3,2) DEFAULT '0.00',
	`isApproved` boolean NOT NULL DEFAULT true,
	`usageCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiTrainingData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `aiConversationContext` ADD CONSTRAINT `aiConversationContext_roomId_groupChatRooms_id_fk` FOREIGN KEY (`roomId`) REFERENCES `groupChatRooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `aiConversationContext` ADD CONSTRAINT `aiConversationContext_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `aiResponses` ADD CONSTRAINT `aiResponses_messageId_groupChatMessages_id_fk` FOREIGN KEY (`messageId`) REFERENCES `groupChatMessages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `aiResponses` ADD CONSTRAINT `aiResponses_trainingDataId_aiTrainingData_id_fk` FOREIGN KEY (`trainingDataId`) REFERENCES `aiTrainingData`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `aiSettings` ADD CONSTRAINT `aiSettings_roomId_groupChatRooms_id_fk` FOREIGN KEY (`roomId`) REFERENCES `groupChatRooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `aiTrainingData` ADD CONSTRAINT `aiTrainingData_adminId_users_id_fk` FOREIGN KEY (`adminId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;