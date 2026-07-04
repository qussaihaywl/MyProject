CREATE TABLE `facebookPages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageId` varchar(100) NOT NULL,
	`pageName` varchar(255) NOT NULL,
	`pageAccessToken` text NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `facebookPages_id` PRIMARY KEY(`id`),
	CONSTRAINT `facebookPages_pageId_unique` UNIQUE(`pageId`)
);
--> statement-breakpoint
CREATE TABLE `productShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`facebookPageId` int NOT NULL,
	`postId` varchar(100),
	`shareUrl` text,
	`status` enum('pending','published','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productShares_id` PRIMARY KEY(`id`)
);
