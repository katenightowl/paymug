ALTER TABLE `stores` ADD `affiliates_enabled` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
ALTER TABLE `stores` ADD `affiliate_commission_type` text DEFAULT 'percentage' NOT NULL;
--> statement-breakpoint
ALTER TABLE `stores` ADD `affiliate_commission_value` real DEFAULT 10 NOT NULL;
--> statement-breakpoint
ALTER TABLE `stores` ADD `affiliate_commission_duration` text DEFAULT 'one_time' NOT NULL;
--> statement-breakpoint
ALTER TABLE `stores` ADD `affiliate_attribution_model` text DEFAULT 'last_click' NOT NULL;
--> statement-breakpoint
ALTER TABLE `stores` ADD `email_campaigns_enabled` integer DEFAULT 1 NOT NULL;
