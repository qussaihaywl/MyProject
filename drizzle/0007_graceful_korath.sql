ALTER TABLE `warehouses` ADD `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `warehouses` DROP COLUMN `location`;--> statement-breakpoint
ALTER TABLE `warehouses` DROP COLUMN `capacity`;--> statement-breakpoint
ALTER TABLE `warehouses` DROP COLUMN `currentUsage`;--> statement-breakpoint
ALTER TABLE `warehouses` DROP COLUMN `manager`;