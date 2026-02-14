-- Remove the recursive policy that links groups -> group_members -> groups
DROP POLICY IF EXISTS "Group members view group" ON public.groups;

-- Ensure the public access policy exists and is correct
-- (If this fails saying it exists, that is fine, we just want to ensure it's the dominant one)
DROP POLICY IF EXISTS "groups_select_policy" ON public.groups;
CREATE POLICY "groups_select_policy" ON public.groups FOR SELECT USING (true);

-- Fix the update policy on group_members which had a weird self-reference in the trace
-- (Optional cleanup, but good for stability)
DROP POLICY IF EXISTS "group_members_update_policy" ON public.group_members;

CREATE OR REPLACE FUNCTION public.check_group_admin_access(_group_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = _group_id
    AND user_id = _user_id
    AND role = 'admin'
  );
END;
$$;

CREATE POLICY "group_members_update_policy" ON public.group_members FOR UPDATE TO authenticated
USING (
  -- Use the secure function to check for admin status to avoid RLS hitting group_members recursively
  public.check_group_admin_access(group_id, auth.uid())
);
