ALTER TABLE `products` RENAME COLUMN `fee_type` TO `transaction_fee_type`;
--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `fee_value` TO `transaction_fee_value`;
--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `fee_amount` TO `transaction_fee_amount`;
