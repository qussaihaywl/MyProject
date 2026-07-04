CREATE TABLE `advancedNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('order_new','order_updated','recommendation','product_available','price_drop','review_response','promotion','system') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`metadata` text,
	`isRead` boolean NOT NULL DEFAULT false,
	`isPriority` boolean NOT NULL DEFAULT false,
	`actionUrl` varchar(500),
	`soundEnabled` boolean NOT NULL DEFAULT true,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `advancedNotifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `advancedSearchFeatures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`searchQuery` varchar(255) NOT NULL,
	`searchType` enum('text','fuzzy','image','voice','filter') NOT NULL,
	`resultsCount` int NOT NULL DEFAULT 0,
	`clickedProductId` int,
	`searchDuration` int,
	`filters` text,
	`sortBy` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `advancedSearchFeatures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productPerformanceReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`period` enum('daily','weekly','monthly') NOT NULL,
	`date` timestamp NOT NULL,
	`views` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`purchases` int NOT NULL DEFAULT 0,
	`revenue` decimal(12,2) NOT NULL DEFAULT '0',
	`averageRating` decimal(3,2),
	`reviewCount` int NOT NULL DEFAULT 0,
	`returnRate` decimal(5,2),
	`conversionRate` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productPerformanceReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviewAnalysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reviewId` int NOT NULL,
	`productId` int NOT NULL,
	`userId` int NOT NULL,
	`sentiment` enum('positive','neutral','negative') NOT NULL,
	`sentimentScore` decimal(3,2),
	`keywordExtraction` text,
	`summary` text,
	`isHelpful` boolean NOT NULL DEFAULT true,
	`helpfulCount` int NOT NULL DEFAULT 0,
	`unhelpfulCount` int NOT NULL DEFAULT 0,
	`analyzedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviewAnalysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salesReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`period` enum('daily','weekly','monthly') NOT NULL,
	`date` timestamp NOT NULL,
	`totalOrders` int NOT NULL DEFAULT 0,
	`totalRevenue` decimal(12,2) NOT NULL DEFAULT '0',
	`totalItems` int NOT NULL DEFAULT 0,
	`averageOrderValue` decimal(10,2) DEFAULT '0',
	`topProductId` int,
	`topCategoryId` int,
	`newCustomers` int NOT NULL DEFAULT 0,
	`returningCustomers` int NOT NULL DEFAULT 0,
	`conversionRate` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `salesReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userBehaviorReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`period` enum('daily','weekly','monthly') NOT NULL,
	`date` timestamp NOT NULL,
	`totalActiveUsers` int NOT NULL DEFAULT 0,
	`totalPageViews` int NOT NULL DEFAULT 0,
	`totalSessions` int NOT NULL DEFAULT 0,
	`averageSessionDuration` int DEFAULT 0,
	`bounceRate` decimal(5,2),
	`topPageUrl` varchar(500),
	`topSearchQuery` varchar(255),
	`deviceType` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userBehaviorReports_id` PRIMARY KEY(`id`)
);
