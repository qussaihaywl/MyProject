CREATE TABLE `productRecommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`productId` int NOT NULL,
	`recommendationType` enum('viewed','purchased','similar','trending','personalized','category_based') NOT NULL,
	`reason` varchar(255),
	`score` decimal(3,2) DEFAULT '0.5',
	`isClicked` boolean NOT NULL DEFAULT false,
	`isConverted` boolean NOT NULL DEFAULT false,
	`clickedAt` timestamp,
	`convertedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productRecommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `searchHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`query` varchar(255) NOT NULL,
	`resultsCount` int NOT NULL DEFAULT 0,
	`categoryId` int,
	`minPrice` decimal(10,2),
	`maxPrice` decimal(10,2),
	`minRating` int,
	`sortBy` varchar(50),
	`sessionId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `searchHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `searchPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`savedFilters` text,
	`defaultSortBy` varchar(50) DEFAULT 'newest',
	`defaultCategoryId` int,
	`preferredPriceRange` text,
	`preferredRating` int,
	`enableAutoSuggestions` boolean NOT NULL DEFAULT true,
	`enableSearchHistory` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `searchPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `searchPreferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `searchSuggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`query` varchar(255) NOT NULL,
	`category` varchar(100),
	`frequency` int NOT NULL DEFAULT 1,
	`isPopular` boolean NOT NULL DEFAULT false,
	`lastUsedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `searchSuggestions_id` PRIMARY KEY(`id`),
	CONSTRAINT `searchSuggestions_query_unique` UNIQUE(`query`)
);
--> statement-breakpoint
CREATE TABLE `similarProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`similarProductId` int NOT NULL,
	`similarityScore` decimal(3,2) NOT NULL,
	`reason` varchar(255),
	`computedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `similarProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trendingProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`period` enum('daily','weekly','monthly') NOT NULL,
	`rank` int NOT NULL,
	`views` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`purchases` int NOT NULL DEFAULT 0,
	`trendScore` decimal(5,2) DEFAULT '0',
	`date` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trendingProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userBehavior` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`behaviorType` enum('view','click','add_to_cart','purchase','favorite','review','search','filter') NOT NULL,
	`productId` int,
	`categoryId` int,
	`metadata` text,
	`sessionId` varchar(255),
	`duration` int,
	`ipAddress` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userBehavior_id` PRIMARY KEY(`id`)
);
