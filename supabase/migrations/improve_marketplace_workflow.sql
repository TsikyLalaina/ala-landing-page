-- Improve Marketplace Workflow

-- 1. Add `min_order_quantity` to listings so sellers can define the minimum amount to be bought
ALTER TABLE public.marketplace_listings 
  ADD COLUMN IF NOT EXISTS min_order_quantity numeric DEFAULT 1;

-- 2. Add `quantity` to transactions to track how much was bought in a specific transaction
ALTER TABLE public.transactions 
  ADD COLUMN IF NOT EXISTS quantity numeric;
