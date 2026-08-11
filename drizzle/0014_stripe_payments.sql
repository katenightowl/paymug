CREATE TABLE `stripe_connections` (
  `user_id` text NOT NULL,
  `secret_key_encrypted` text NOT NULL,
  `webhook_secret_encrypted` text,
  `account_id` text NOT NULL,
  `mode` text DEFAULT 'sandbox' NOT NULL,
  `connected_at` text NOT NULL,
  PRIMARY KEY(`user_id`, `mode`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `orders` ADD `stripe_checkout_session_id` text;
--> statement-breakpoint
ALTER TABLE `orders` ADD `stripe_payment_intent_id` text;
