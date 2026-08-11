ALTER TABLE `users` ADD `environment` text DEFAULT 'sandbox' NOT NULL;
--> statement-breakpoint
PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TABLE `__new_paypal_connections` (
	`user_id` text NOT NULL,
	`client_id` text NOT NULL,
	`client_secret_encrypted` text NOT NULL,
	`mode` text DEFAULT 'sandbox' NOT NULL,
	`merchant_email` text,
	`connected_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `mode`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_paypal_connections`(
	"user_id",
	"client_id",
	"client_secret_encrypted",
	"mode",
	"merchant_email",
	"connected_at"
)
SELECT
	"user_id",
	"client_id",
	"client_secret_encrypted",
	"mode",
	"merchant_email",
	"connected_at"
FROM `paypal_connections`;
--> statement-breakpoint
DROP TABLE `paypal_connections`;
--> statement-breakpoint
ALTER TABLE `__new_paypal_connections` RENAME TO `paypal_connections`;
--> statement-breakpoint
PRAGMA foreign_keys=ON;
