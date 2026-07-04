ALTER TABLE `showcaseVideos` ADD `videoType` enum('direct','youtube') DEFAULT 'direct' NOT NULL;--> statement-breakpoint
ALTER TABLE `showcaseVideos` ADD `youtubeId` varchar(50);--> statement-breakpoint
ALTER TABLE `showcaseVideos` ADD `youtubeUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `showcaseVideos` ADD `displayIds` text;--> statement-breakpoint
ALTER TABLE `showcaseVideos` ADD `views` int DEFAULT 0 NOT NULL;