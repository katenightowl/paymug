CREATE TABLE `github_connections` (
  `user_id` text PRIMARY KEY NOT NULL,
  `github_user_id` text NOT NULL,
  `login` text NOT NULL,
  `access_token_encrypted` text NOT NULL,
  `scopes` text DEFAULT '' NOT NULL,
  `connected_at` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `products` ADD `github_repo_owner` text;
--> statement-breakpoint
ALTER TABLE `products` ADD `github_repo_name` text;
--> statement-breakpoint
ALTER TABLE `orders` ADD `github_username` text;
--> statement-breakpoint
ALTER TABLE `orders` ADD `github_access_status` text DEFAULT 'not_required' NOT NULL;
--> statement-breakpoint
ALTER TABLE `orders` ADD `github_access_managed` integer DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE `orders` ADD `github_invitation_id` text;
--> statement-breakpoint
ALTER TABLE `orders` ADD `github_access_error` text;
--> statement-breakpoint
ALTER TABLE `orders` ADD `github_access_granted_at` text;
--> statement-breakpoint
ALTER TABLE `orders` ADD `github_access_revoked_at` text;
