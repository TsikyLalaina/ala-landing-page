-- 1. Ensure Groups Table Exists (already in schema, but good for safety)
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  creator_id uuid REFERENCES public.users(id),
  is_public boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- 2. Ensure Group Members Table Exists
CREATE TABLE IF NOT EXISTS public.group_members (
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  joined_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

-- 3. Add group_id to Posts Table (CRITICAL: This is missing in the base schema)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES public.groups(id) ON DELETE SET NULL;

-- 4. Ensure Votes Table Exists
CREATE TABLE IF NOT EXISTS public.votes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  vote_value integer NOT NULL CHECK (vote_value IN (-1, 0, 1)),
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- 5. Add Unique Constraint to Votes (CRITICAL for 'upsert' functionality)
-- The base schema might lack this constraint, enabling duplicate votes or breaking the toggle logic.
CREATE UNIQUE INDEX IF NOT EXISTS votes_post_user_unique ON public.votes(post_id, user_id);

-- 6. Enable RLS (Safe to run multiple times)
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- 7. Upsert Policies (Drop first to avoid conflicts if they exist)

-- Policies for Groups
DROP POLICY IF EXISTS "Groups are viewable by everyone" ON public.groups;
CREATE POLICY "Groups are viewable by everyone" ON public.groups FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create groups" ON public.groups;
CREATE POLICY "Users can create groups" ON public.groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can update groups" ON public.groups;
CREATE POLICY "Creators can update groups" ON public.groups FOR UPDATE USING (auth.uid() = creator_id);

-- Policies for Group Members
DROP POLICY IF EXISTS "Group members are viewable by everyone" ON public.group_members;
CREATE POLICY "Group members are viewable by everyone" ON public.group_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
CREATE POLICY "Users can join groups" ON public.group_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;
CREATE POLICY "Users can leave groups" ON public.group_members FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies for Votes
DROP POLICY IF EXISTS "Votes are viewable by everyone" ON public.votes;
CREATE POLICY "Votes are viewable by everyone" ON public.votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Group members can vote" ON public.votes;
CREATE POLICY "Group members can vote" ON public.votes FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = votes.group_id AND user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update their own vote" ON public.votes;
CREATE POLICY "Users can update their own vote" ON public.votes FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own vote" ON public.votes;
CREATE POLICY "Users can delete their own vote" ON public.votes FOR DELETE TO authenticated USING (auth.uid() = user_id);
