CREATE TABLE `advancedOrdersEnhanced` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`productId` int,
	`productName` varchar(200) NOT NULL,
	`productPrice` decimal(10,2) NOT NULL,
	`categoryId` int,
	`customerId` int,
	`customerName` varchar(100) NOT NULL,
	`customerPhone` varchar(20) NOT NULL,
	`customerEmail` varchar(100),
	`governorate` varchar(100) NOT NULL,
	`detailedLocation` text NOT NULL,
	`delegateId` int,
	`delegateName` varchar(100) NOT NULL,
	`delegateCommission` decimal(10,2),
	`warehouseId` int,
	`warehouseCode` varchar(50) NOT NULL,
	`orderDate` timestamp NOT NULL DEFAULT (now()),
	`orderNotes` text,
	`weight` varchar(50),
	`length` varchar(50),
	`color` varchar(50),
	`size` varchar(50),
	`images` text,
	`videos` text,
	`status` enum('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`paymentStatus` enum('unpaid','partial','paid') NOT NULL DEFAULT 'unpaid',
	`shippingCost` decimal(10,2) NOT NULL DEFAULT '0',
	`totalAmount` decimal(10,2) NOT NULL,
	`whatsappSent` boolean NOT NULL DEFAULT false,
	`emailSent` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advancedOrdersEnhanced_id` PRIMARY KEY(`id`),
	CONSTRAINT `advancedOrdersEnhanced_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `emailLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`type` varchar(50) NOT NULL,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailVerifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`verified` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailVerifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailVerifications_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `passwordResets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`used` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `passwordResets_id` PRIMARY KEY(`id`),
	CONSTRAINT `passwordResets_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `twoFactorAuth` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`secret` varchar(255) NOT NULL,
	`backupCodes` text NOT NULL,
	`enabled` boolean NOT NULL DEFAULT false,
	`verifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `twoFactorAuth_id` PRIMARY KEY(`id`),
	CONSTRAINT `twoFactorAuth_userId_unique` UNIQUE(`userId`)
);
