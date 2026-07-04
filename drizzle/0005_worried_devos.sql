ALTER TABLE `categories` ADD `displayOrder` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `categories` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `categories` ADD `showOnHomepage` boolean DEFAULT true NOT NULL;