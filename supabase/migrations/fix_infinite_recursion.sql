-- Fix for partial infinite recursion error (42P17) in group_members policy

-- 1. Create a SECURITY DEFINER function to check membership safely.
-- This function runs with the privileges of the database owner, bypassing RLS on group_members
-- to avoid the recursive loop when the policy calls itself.
CREATE OR REPLACE FUNCTION public.has_group_access(_group_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = _group_id
    AND user_id = _user_id
    AND status IN ('admin', 'member')
  );
$$;

-- 2. Drop the recursive policy
DROP POLICY IF EXISTS "Group members visibility" ON public.group_members;

-- 3. Re-create the policy using the secure function
CREATE POLICY "Group members visibility" ON public.group_members FOR SELECT
USING (
  -- Option 1: The group is public (anyone can view members)
  (SELECT is_public FROM public.groups WHERE id = group_members.group_id) = true
  OR
  -- Option 2: The user is viewing their own membership
  user_id = auth.uid()
  OR
  -- Option 3: The user is a confirmed member/admin of the group (using the safe function)
  has_group_access(group_members.group_id, auth.uid())
);
