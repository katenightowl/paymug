ALTER TABLE `paypal_connections` ADD `webhook_id` text;
--> statement-breakpoint
ALTER TABLE `paypal_connections` ADD `webhook_url` text;
--> statement-breakpoint
ALTER TABLE `paypal_connections` ADD `webhook_status` text DEFAULT 'not_configured' NOT NULL;
--> statement-breakpoint
ALTER TABLE `paypal_connections` ADD `webhook_error` text;
