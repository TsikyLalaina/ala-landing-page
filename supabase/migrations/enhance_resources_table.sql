-- Enhance existing resources table for educational library

-- Add missing columns
ALTER TABLE public.resources 
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'guide',
  ADD COLUMN IF NOT EXISTS tags text[],
  ADD COLUMN IF NOT EXISTS language text DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS duration text, -- e.g. "5 min read", "12:30"
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Convert type to text if it's an enum (safer for flexibility)
ALTER TABLE public.resources 
  ALTER COLUMN type DROP DEFAULT;
ALTER TABLE public.resources 
  ALTER COLUMN type TYPE text USING type::text;
ALTER TABLE public.resources 
  ALTER COLUMN type SET DEFAULT 'article';

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Anyone can view approved resources" ON public.resources;
DROP POLICY IF EXISTS "Users can create resources" ON public.resources;
DROP POLICY IF EXISTS "Users can update own resources" ON public.resources;
DROP POLICY IF EXISTS "Users can delete own resources" ON public.resources;

-- Policies
-- 1. Anyone can view approved resources
CREATE POLICY "Anyone can view approved resources" ON public.resources
FOR SELECT USING (approved = true OR auth.uid() = user_id);

-- 2. Authenticated users can upload resources
CREATE POLICY "Users can create resources" ON public.resources
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own resources
CREATE POLICY "Users can update own resources" ON public.resources
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 4. Users can delete their own resources  
CREATE POLICY "Users can delete own resources" ON public.resources
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create storage bucket for resource files
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resources bucket
DROP POLICY IF EXISTS "Resource files are public" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload resource files" ON storage.objects;

CREATE POLICY "Resource files are public" ON storage.objects
FOR SELECT USING (bucket_id = 'resources');

CREATE POLICY "Users can upload resource files" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resources');
