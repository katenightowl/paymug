CREATE TABLE `stores` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `cover_image_url` text,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stores_slug_idx` ON `stores` (`slug`);
--> statement-breakpoint
CREATE INDEX `stores_user_idx` ON `stores` (`user_id`);
--> statement-breakpoint
ALTER TABLE `users` ADD `active_store_id` text;
--> statement-breakpoint
INSERT INTO `stores` (`id`, `user_id`, `name`, `slug`, `created_at`, `updated_at`)
SELECT `id`, `id`, `store_name`, `store_slug`, `created_at`, `created_at`
FROM `users`;
--> statement-breakpoint
UPDATE `users` SET `active_store_id` = `id`;
--> statement-breakpoint
ALTER TABLE `products` ADD `store_id` text REFERENCES `stores`(`id`) ON DELETE cascade;
--> statement-breakpoint
UPDATE `products` SET `store_id` = `user_id`;
--> statement-breakpoint
ALTER TABLE `orders` ADD `store_id` text REFERENCES `stores`(`id`) ON DELETE cascade;
--> statement-breakpoint
UPDATE `orders` SET `store_id` = `user_id`;
