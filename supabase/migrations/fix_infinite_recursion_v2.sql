-- Robust fix for infinite recursion 42P17
-- 1. Drop existing problematic policies and functions to start fresh
DROP POLICY IF EXISTS "Group members visibility" ON public.group_members;
DROP POLICY IF EXISTS "Group members are viewable by everyone" ON public.group_members;
DROP FUNCTION IF EXISTS public.has_group_access;

-- 2. Create the helper function with specific table references and SECURITY DEFINER
-- We use a new name 'check_user_membership' to ensure no cache conflicts.
-- We explicitly set the search path to public to avoid path hijacking.
CREATE OR REPLACE FUNCTION public.check_user_membership(_group_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- This query runs as the database owner (likely postgres/admin), bypassing RLS
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = _group_id
    AND user_id = _user_id
    AND status IN ('admin', 'member')
  );
$$;

-- 3. Create the simplified non-recursive policy
CREATE POLICY "view_group_members_policy" ON public.group_members FOR SELECT
USING (
  -- Cast boolean check explicitly to avoid ambiguity
  (SELECT is_public FROM public.groups WHERE id = group_members.group_id) IS TRUE
  OR
  -- User can always see their own row
  user_id = auth.uid()
  OR
  -- Use the security definer function to check if the viewer is a member/admin
  -- This breaks the recursion because the function does not trigger RLS
  public.check_user_membership(group_members.group_id, auth.uid())
);

-- 4. Ensure other operations are permitted (if not already handled)
-- (Re-applying these safe policies to be sure)
DROP POLICY IF EXISTS "Users can request to join" ON public.group_members;
CREATE POLICY "join_request_policy" ON public.group_members FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update members" ON public.group_members;
CREATE POLICY "admin_update_policy" ON public.group_members FOR UPDATE TO authenticated
USING (
  public.check_user_membership(group_members.group_id, auth.uid()) -- simplified: admins are members
  AND 
  EXISTS ( -- Strict check for admin role
     SELECT 1 FROM public.group_members 
     WHERE group_id = group_members.group_id 
     AND user_id = auth.uid() 
     AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;
CREATE POLICY "leave_policy" ON public.group_members FOR DELETE TO authenticated
USING (auth.uid() = user_id);
