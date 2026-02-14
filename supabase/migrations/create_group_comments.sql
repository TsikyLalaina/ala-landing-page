-- Create group_comments table
CREATE TABLE IF NOT EXISTS public.group_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE, -- Denormalized for easier RLS
  parent_id uuid REFERENCES public.group_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.group_comments ENABLE ROW LEVEL SECURITY;

-- Helper function for RLS (reusing or creating new if needed)
-- We can reuse public.is_group_member or public.can_view_post logic

-- Policies
-- 1. Select: Visible if you can view the group (Public or Member)
CREATE POLICY "view_group_comments" ON public.group_comments FOR SELECT
USING (
  -- Public Group
  (SELECT is_public FROM public.groups WHERE id = group_comments.group_id) = true
  OR
  -- Member of Private Group
  (
    EXISTS (
        SELECT 1 FROM public.group_members
        WHERE group_id = group_comments.group_id
        AND user_id = auth.uid()
        AND status IN ('member', 'admin')
    )
  )
);

-- 2. Insert: Must be a member to comment
CREATE POLICY "insert_group_comments" ON public.group_comments FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND 
  EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = group_comments.group_id 
    AND user_id = auth.uid()
    AND status IN ('member', 'admin')
  )
);

-- 3. Update: Own comments
CREATE POLICY "update_own_group_comments" ON public.group_comments FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- 4. Delete: Own comments or Group Admin
CREATE POLICY "delete_group_comments" ON public.group_comments FOR DELETE TO authenticated
USING (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = group_comments.group_id
    AND user_id = auth.uid()
    AND role = 'admin'
    AND status IN ('member', 'admin')
  )
);
