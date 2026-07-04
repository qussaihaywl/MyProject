CREATE TABLE `customerAddresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('billing','shipping','other') NOT NULL DEFAULT 'shipping',
	`fullName` varchar(100) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`street` varchar(200) NOT NULL,
	`city` varchar(100) NOT NULL,
	`state` varchar(100),
	`postalCode` varchar(20),
	`country` varchar(100) NOT NULL,
	`isDefault` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customerAddresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderStatusHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`previousStatus` varchar(50) NOT NULL,
	`newStatus` varchar(50) NOT NULL,
	`changedBy` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderStatusHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shipments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`trackingNumber` varchar(100),
	`shippingMethod` varchar(50) NOT NULL,
	`carrier` varchar(100),
	`estimatedDeliveryDate` timestamp,
	`actualDeliveryDate` timestamp,
	`shippingCost` decimal(10,2) NOT NULL DEFAULT '0',
	`status` enum('pending','in_transit','out_for_delivery','delivered','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shipments_id` PRIMARY KEY(`id`),
	CONSTRAINT `shipments_orderId_unique` UNIQUE(`orderId`),
	CONSTRAINT `shipments_trackingNumber_unique` UNIQUE(`trackingNumber`)
);
--> statement-breakpoint
ALTER TABLE `orders` ADD `orderNumber` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentStatus` enum('unpaid','partial','paid') DEFAULT 'unpaid' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`);