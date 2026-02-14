-- Marketplace Tables

-- 1. Listings Table
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price numeric NOT NULL, -- Starting price for auctions, fixed price for sales
  currency text DEFAULT 'MGA', -- MGA, EUR, USD
  listing_type text DEFAULT 'fixed', -- 'fixed', 'auction'
  category text, -- 'vanilla', 'spices', 'crafts', etc.
  status text DEFAULT 'active', -- 'active', 'sold', 'cancelled'
  image_urls text[], -- Array of image URLs
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- 2. Bids Table (for auctions)
CREATE TABLE IF NOT EXISTS public.bids (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  bidder_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- 3. Transactions Table (Log sales)
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

-- Enable RLS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies for Listings
-- Everyone can view active listings
CREATE POLICY "Active listings are viewable by everyone" ON public.marketplace_listings
FOR SELECT USING (status = 'active' OR auth.uid() = seller_id);

-- Auth users can create listings
CREATE POLICY "Users can create listings" ON public.marketplace_listings
FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);

-- Sellers can update their own listings
CREATE POLICY "Sellers can update own listings" ON public.marketplace_listings
FOR UPDATE TO authenticated USING (auth.uid() = seller_id);

-- Sellers can delete their own listings
CREATE POLICY "Sellers can delete own listings" ON public.marketplace_listings
FOR DELETE TO authenticated USING (auth.uid() = seller_id);

-- Policies for Bids
-- Everyone can view bids on active listings (transparency)
CREATE POLICY "Bids are viewable by everyone" ON public.bids FOR SELECT USING (true);

-- Auth users can bid
CREATE POLICY "Users can place bids" ON public.bids
FOR INSERT TO authenticated WITH CHECK (auth.uid() = bidder_id);

-- Policies for Transactions
-- Only involved parties can view transaction logs
CREATE POLICY "Involved parties view transactions" ON public.transactions
FOR SELECT TO authenticated USING (
  auth.uid() = seller_id OR auth.uid() = buyer_id
);

-- System/Trigger usually handles transaction creation, but for now allow auth for simulation
CREATE POLICY "Users can create transactions" ON public.transactions
FOR INSERT TO authenticated WITH CHECK (true);
