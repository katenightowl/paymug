ALTER TABLE `products` ADD `license_type` text DEFAULT 'standard' NOT NULL;
--> statement-breakpoint
ALTER TABLE `products` ADD `license_update_period_unit` text;
--> statement-breakpoint
ALTER TABLE `products` ADD `license_update_period_count` integer DEFAULT 1 NOT NULL;
