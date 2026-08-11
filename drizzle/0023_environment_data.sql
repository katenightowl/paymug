ALTER TABLE `products` ADD `environment` text DEFAULT 'sandbox' NOT NULL;
--> statement-breakpoint
ALTER TABLE `feature_records` ADD `environment` text DEFAULT 'sandbox' NOT NULL;
--> statement-breakpoint
ALTER TABLE `notifications` ADD `environment` text DEFAULT 'sandbox' NOT NULL;
--> statement-breakpoint
UPDATE `products` SET `environment` = COALESCE((SELECT `environment` FROM `users` WHERE `users`.`id` = `products`.`user_id`), 'sandbox');
--> statement-breakpoint
UPDATE `feature_records` SET `environment` = COALESCE((SELECT `environment` FROM `users` WHERE `users`.`id` = `feature_records`.`user_id`), 'sandbox');
--> statement-breakpoint
UPDATE `notifications` SET `environment` = COALESCE((SELECT `environment` FROM `users` WHERE `users`.`id` = `notifications`.`user_id`), 'sandbox');
--> statement-breakpoint
DROP INDEX `notifications_user_source_idx`;
--> statement-breakpoint
CREATE UNIQUE INDEX `notifications_user_environment_source_idx` ON `notifications` (`user_id`,`environment`,`source_key`);
