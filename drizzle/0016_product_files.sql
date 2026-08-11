ALTER TABLE `products` ADD `product_files` text DEFAULT '[]' NOT NULL;
--> statement-breakpoint
ALTER TABLE `orders` ADD `product_files` text DEFAULT '[]' NOT NULL;
