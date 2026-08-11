ALTER TABLE `products` ADD `fee_type` text DEFAULT 'fixed' NOT NULL;
--> statement-breakpoint
ALTER TABLE `products` ADD `fee_value` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `orders` ADD `fee_amount` integer DEFAULT 0 NOT NULL;
