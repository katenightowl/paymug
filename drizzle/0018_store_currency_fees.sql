ALTER TABLE `stores` ADD `currency` text DEFAULT 'USD' NOT NULL;
--> statement-breakpoint
ALTER TABLE `stores` ADD `transaction_fee_type` text DEFAULT 'fixed' NOT NULL;
--> statement-breakpoint
ALTER TABLE `stores` ADD `transaction_fee_value` integer DEFAULT 0 NOT NULL;
