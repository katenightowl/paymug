ALTER TABLE `products` ADD `billing_type` text DEFAULT 'one_time' NOT NULL;
ALTER TABLE `products` ADD `interval_unit` text;
ALTER TABLE `products` ADD `interval_count` integer DEFAULT 1 NOT NULL;
ALTER TABLE `products` ADD `trial_days` integer DEFAULT 0 NOT NULL;
