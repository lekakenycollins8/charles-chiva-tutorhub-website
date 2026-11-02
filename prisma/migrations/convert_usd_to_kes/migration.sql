-- Convert resource prices from USD to KES (1 USD = 130 KES)
UPDATE "Resource" SET "price" = "price" * 130 WHERE "isPaid" = true AND "price" IS NOT NULL;
