-- Fix numeric field precision for marketplace_listings
-- Remove overly restrictive precision constraints on price and quantity

ALTER TABLE public.marketplace_listings 
  ALTER COLUMN price TYPE numeric(15, 2);

ALTER TABLE public.marketplace_listings 
  ALTER COLUMN quantity TYPE numeric(10, 3);
