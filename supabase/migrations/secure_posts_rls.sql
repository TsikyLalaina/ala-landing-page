-- Secure Post Visibility for Private Groups

-- 1. Create a helper function to decide post visibility securely
-- This function runs as the database owner (SECURITY DEFINER) to bypass RLS on groups/members
-- preventing recursion and simplifying the policy logic.
CREATE OR REPLACE FUNCTION public.can_view_post(_group_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_public boolean;
BEGIN
  -- 1. General Feed Post (Not in any group)
  IF _group_id IS NULL THEN
    RETURN TRUE;
  END IF;

  -- 2. Check Group Public/Private status
  SELECT is_public INTO v_is_public FROM public.groups WHERE id = _group_id;
  
  -- If group not found, deny access
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- If Group is Public, allow access
  IF v_is_public THEN
    RETURN TRUE;
  END IF;

  -- 3. Private Group: Check if user is an active member/admin
  RETURN EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = _group_id
    AND user_id = _user_id
    AND status IN ('member', 'admin')
  );
END;
$$;

-- 2. Drop the overly permissive existing policy
DROP POLICY IF EXISTS "Authenticated users view all posts" ON public.posts;

-- 3. Create the new secure SELECT policy
CREATE POLICY "view_posts_securely" ON public.posts FOR SELECT TO authenticated
USING (
  public.can_view_post(group_id, auth.uid())
);
