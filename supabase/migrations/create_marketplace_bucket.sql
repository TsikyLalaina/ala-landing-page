-- Create storage bucket for marketplace
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace', 'marketplace', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- 1. Everyone can view files in marketplace bucket
CREATE POLICY "Marketplace images are public" ON storage.objects
FOR SELECT USING (bucket_id = 'marketplace');

-- 2. Authenticated users can upload files to marketplace bucket
CREATE POLICY "Users can upload marketplace images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'marketplace' AND auth.uid() = owner
);

-- 3. Users can update their own files
CREATE POLICY "Users can update own marketplace images" ON storage.objects
FOR UPDATE TO authenticated USING (
  bucket_id = 'marketplace' AND auth.uid() = owner
);

-- 4. Users can delete their own files
CREATE POLICY "Users can delete own marketplace images" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'marketplace' AND auth.uid() = owner
);
