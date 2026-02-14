-- ================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Setup all storage buckets (avatars + post_media)
-- ================================================

-- 1. Create 'avatars' bucket if missing
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Create 'post_media' bucket if missing
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post_media', 'post_media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Reset Policies for 'avatars' (to be safe)
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars." ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatars." ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete avatars." ON storage.objects;

CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars."
  ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can update avatars."
  ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can delete avatars."
  ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars');

-- 4. Reset Policies for 'post_media' (to be safe)
DROP POLICY IF EXISTS "Post media is publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload post media." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own post media." ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own post media." ON storage.objects;

CREATE POLICY "Post media is publicly accessible."
  ON storage.objects FOR SELECT TO public USING (bucket_id = 'post_media');

CREATE POLICY "Authenticated users can upload post media."
  ON storage.objects FOR INSERT TO authenticated 
  WITH CHECK (bucket_id = 'post_media');

CREATE POLICY "Users can update their own post media."
  ON storage.objects FOR UPDATE TO authenticated 
  USING (bucket_id = 'post_media' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own post media."
  ON storage.objects FOR DELETE TO authenticated 
  USING (bucket_id = 'post_media' AND auth.uid() = owner);
