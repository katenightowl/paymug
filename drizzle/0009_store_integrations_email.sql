ALTER TABLE `stores` ADD `email_from` text;
--> statement-breakpoint
ALTER TABLE `stores` ADD `email_reply_to` text;
--> statement-breakpoint
ALTER TABLE `stores` ADD `payment_credential_source_store_id` text;
--> statement-breakpoint
ALTER TABLE `stores` ADD `github_credential_source_store_id` text;
--> statement-breakpoint
UPDATE `stores`
SET
  `payment_credential_source_store_id` = `id`,
  `github_credential_source_store_id` = `id`;
