-- Fix Crisis Alerts Schema to match application code

-- 1. Rename creator_id to created_by if it exists
DO $$
BEGIN
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'crisis_alerts' AND column_name = 'creator_id') THEN
    ALTER TABLE public.crisis_alerts RENAME COLUMN creator_id TO created_by;
  END IF;
END $$;

-- 2. Add missing columns
ALTER TABLE public.crisis_alerts 
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.users(id) ON DELETE CASCADE, -- Ensure column exists if rename failed or didn't exist
  ADD COLUMN IF NOT EXISTS crisis_type text DEFAULT 'cyclone',
  ADD COLUMN IF NOT EXISTS alert_type text DEFAULT 'warning',
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS instructions text,
  ADD COLUMN IF NOT EXISTS latitude numeric,
  ADD COLUMN IF NOT EXISTS longitude numeric,
  ADD COLUMN IF NOT EXISTS affected_radius_km numeric DEFAULT 10,
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now(),
  ADD COLUMN IF NOT EXISTS resolved_at timestamp with time zone;

-- 3. Handle severity
-- Drop NOT NULL constraint on existing severity enum column so we can ignore it
ALTER TABLE public.crisis_alerts ALTER COLUMN severity DROP NOT NULL;

-- The existing severity is a custom enum. We'll add strict integer severity for our app logic
ALTER TABLE public.crisis_alerts 
  ADD COLUMN IF NOT EXISTS severity_level integer DEFAULT 3 CHECK (severity_level >= 1 AND severity_level <= 5);

-- 4. Create Crisis Responses Table (if not exists)
CREATE TABLE IF NOT EXISTS public.crisis_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  alert_id uuid REFERENCES public.crisis_alerts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  response_type text NOT NULL DEFAULT 'info',
  content text NOT NULL,
  location text,
  latitude numeric,
  longitude numeric,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- 5. Enable RLS
ALTER TABLE public.crisis_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_responses ENABLE ROW LEVEL SECURITY;

-- 6. Re-apply Policies
DROP POLICY IF EXISTS "Anyone can view crisis alerts" ON public.crisis_alerts;
DROP POLICY IF EXISTS "Users can create crisis alerts" ON public.crisis_alerts;
DROP POLICY IF EXISTS "Creators can update crisis alerts" ON public.crisis_alerts;

CREATE POLICY "Anyone can view crisis alerts" ON public.crisis_alerts
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create crisis alerts" ON public.crisis_alerts
FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update crisis alerts" ON public.crisis_alerts
FOR UPDATE TO authenticated USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Anyone can view crisis responses" ON public.crisis_responses;
DROP POLICY IF EXISTS "Users can add crisis responses" ON public.crisis_responses;

CREATE POLICY "Anyone can view crisis responses" ON public.crisis_responses
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can add crisis responses" ON public.crisis_responses
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 7. Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('crisis', 'crisis', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Crisis images are viewable" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload crisis images" ON storage.objects;

CREATE POLICY "Crisis images are viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'crisis');

CREATE POLICY "Users can upload crisis images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'crisis');
