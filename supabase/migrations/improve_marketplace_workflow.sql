-- Improve Marketplace Workflow
-- Adds purchase request system, transaction status, stock tracking, and listing lifecycle

-- 1. Add `min_order_quantity` to listings so sellers can define the minimum amount to be bought
ALTER TABLE public.marketplace_listings 
  ADD COLUMN IF NOT EXISTS min_order_quantity numeric DEFAULT 1;

-- 2. Add `quantity` and `status` to transactions for the purchase request workflow
ALTER TABLE public.transactions 
  ADD COLUMN IF NOT EXISTS quantity numeric;

ALTER TABLE public.transactions 
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
-- status values: 'pending', 'accepted', 'denied', 'completed', 'cancelled'

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- 3. Allow sellers to update transactions they are involved in (accept/deny)
DROP POLICY IF EXISTS "Sellers can update own transactions" ON public.transactions;
CREATE POLICY "Sellers can update own transactions" ON public.transactions
  FOR UPDATE TO authenticated USING (auth.uid() = seller_id);

-- 4. Allow buyers to update their own transactions (cancel)
DROP POLICY IF EXISTS "Buyers can update own transactions" ON public.transactions;
CREATE POLICY "Buyers can update own transactions" ON public.transactions
  FOR UPDATE TO authenticated USING (auth.uid() = buyer_id);

-- 5. Update marketplace listing policy to allow viewing expired/closed listings (read-only)
DROP POLICY IF EXISTS "Active listings are viewable by everyone" ON public.marketplace_listings;
CREATE POLICY "All listings are viewable by everyone" ON public.marketplace_listings
  FOR SELECT USING (true);
