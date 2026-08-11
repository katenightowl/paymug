ALTER TABLE `orders` ADD `product_description` text;
--> statement-breakpoint
ALTER TABLE `orders` ADD `product_price` integer;
--> statement-breakpoint
UPDATE `orders`
SET
  `product_description` = (
    SELECT `description`
    FROM `products`
    WHERE `products`.`id` = `orders`.`product_id`
  ),
  `product_price` = (
    SELECT `price`
    FROM `products`
    WHERE `products`.`id` = `orders`.`product_id`
  );
