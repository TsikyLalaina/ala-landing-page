-- Fix Marketplace Schema
-- The active_listings table already exists with user_id instead of seller_id
-- We need to align the database with the new application code

-- 1. Update marketplace_listings table
ALTER TABLE public.marketplace_listings 
  RENAME COLUMN user_id TO seller_id;

ALTER TABLE public.marketplace_listings 
  RENAME COLUMN media_urls TO image_urls;

ALTER TABLE public.marketplace_listings 
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'vanilla',
  ADD COLUMN IF NOT EXISTS listing_type text DEFAULT 'fixed';

-- Convert status to text to ensure compatibility with 'active', 'sold' strings
ALTER TABLE public.marketplace_listings 
  ALTER COLUMN status DROP DEFAULT;
  
ALTER TABLE public.marketplace_listings 
  ALTER COLUMN status TYPE text USING status::text;
  
ALTER TABLE public.marketplace_listings 
  ALTER COLUMN status SET DEFAULT 'active';

-- Rename Foreign Key Constraint to match the new column name
-- This is important for Supabase PostgREST resource embedding
ALTER TABLE public.marketplace_listings 
  RENAME CONSTRAINT marketplace_listings_user_id_fkey TO marketplace_listings_seller_id_fkey;

-- 2. Create Transactions Table (It was missing in the schema)
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES public.marketplace_listings(id),
  seller_id uuid REFERENCES public.users(id),
  buyer_id uuid REFERENCES public.users(id),
  amount numeric NOT NULL,
  currency text DEFAULT 'MGA',
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- 3. Enable RLS on all tables
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 4. Re-apply Policies (Drop old ones to ensure clean slate)

-- Listings Policies
DROP POLICY IF EXISTS "Active listings are viewable by everyone" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Users can create listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Sellers can update own listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Sellers can delete own listings" ON public.marketplace_listings;

CREATE POLICY "Active listings are viewable by everyone" ON public.marketplace_listings
FOR SELECT USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "Users can create listings" ON public.marketplace_listings
FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own listings" ON public.marketplace_listings
FOR UPDATE TO authenticated USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own listings" ON public.marketplace_listings
FOR DELETE TO authenticated USING (auth.uid() = seller_id);

-- Bids Policies
DROP POLICY IF EXISTS "Bids are viewable by everyone" ON public.bids;
DROP POLICY IF EXISTS "Users can place bids" ON public.bids;

CREATE POLICY "Bids are viewable by everyone" ON public.bids FOR SELECT USING (true);

CREATE POLICY "Users can place bids" ON public.bids
FOR INSERT TO authenticated WITH CHECK (auth.uid() = bidder_id);

-- Transactions Policies
DROP POLICY IF EXISTS "Involved parties view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create transactions" ON public.transactions;

CREATE POLICY "Involved parties view transactions" ON public.transactions
FOR SELECT TO authenticated USING (
  auth.uid() = seller_id OR auth.uid() = buyer_id
);

CREATE POLICY "Users can create transactions" ON public.transactions
FOR INSERT TO authenticated WITH CHECK (true);
