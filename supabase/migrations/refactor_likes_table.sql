-- 1. Drop the existing primary key constraint
-- We use existing data to determine the likely constraint name, usually 'likes_pkey'
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_pkey;

-- 2. Add a new generic ID column to serve as the new Primary Key
-- This is safer and more flexible for Supabase than composite keys
ALTER TABLE likes ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- 3. Now we can safely make comment_id nullable
ALTER TABLE likes ALTER COLUMN comment_id DROP NOT NULL;

-- 4. Ensure we have a unique constraint so users can't like the same thing twice
-- (Since we removed the composite PK which likely enforced this)
CREATE UNIQUE INDEX IF NOT EXISTS unique_post_likes ON likes (user_id, post_id) WHERE comment_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS unique_comment_likes ON likes (user_id, comment_id) WHERE post_id IS NULL;
