CREATE TABLE `customer_accounts` (
  `id` text PRIMARY KEY NOT NULL,
  `email` text NOT NULL,
  `password_hash` text,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_accounts_email_unique` ON `customer_accounts` (`email`);
--> statement-breakpoint
CREATE TABLE `customer_access_tokens` (
  `id` text PRIMARY KEY NOT NULL,
  `customer_id` text NOT NULL,
  `token_hash` text NOT NULL,
  `expires_at` text NOT NULL,
  `used_at` text,
  `created_at` text NOT NULL,
  FOREIGN KEY (`customer_id`) REFERENCES `customer_accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_access_tokens_token_hash_unique` ON `customer_access_tokens` (`token_hash`);
--> statement-breakpoint
CREATE INDEX `customer_access_tokens_customer_idx` ON `customer_access_tokens` (`customer_id`);
--> statement-breakpoint
CREATE INDEX `customer_access_tokens_expiry_idx` ON `customer_access_tokens` (`expires_at`);
--> statement-breakpoint
ALTER TABLE `orders` ADD `delivery_content` text;
--> statement-breakpoint
ALTER TABLE `orders` ADD `github_repo_owner` text;
--> statement-breakpoint
ALTER TABLE `orders` ADD `github_repo_name` text;
