-- Fix recursion on UPDATE/DELETE by using SECURITY DEFINER functions for admin checks

-- 1. Create/Ensure the Admin Check Function exists
CREATE OR REPLACE FUNCTION public.is_group_admin(_group_id uuid, _user_id uuid)
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
    AND status IN ('admin', 'member') -- Ensure they are active
  );
END;
$$;

-- 2. Drop problematic inline policies
DROP POLICY IF EXISTS "group_members_update_policy" ON public.group_members;
DROP POLICY IF EXISTS "admins_delete_members_policy" ON public.group_members;
DROP POLICY IF EXISTS "group_members_delete_policy" ON public.group_members; -- From previous migrations
DROP POLICY IF EXISTS "members_delete" ON public.group_members; -- From force_reset_policies.sql
DROP POLICY IF EXISTS "members_update" ON public.group_members; -- From force_reset_policies.sql

-- 3. Recreate UPDATE Policy (Admins only)
CREATE POLICY "group_members_update_policy" ON public.group_members FOR UPDATE TO authenticated
USING (
  public.is_group_admin(group_id, auth.uid())
);

-- 4. Recreate DELETE Policy (Admins OR Self)
CREATE POLICY "group_members_delete_policy" ON public.group_members FOR DELETE TO authenticated
USING (
  auth.uid() = user_id -- Self leave
  OR
  public.is_group_admin(group_id, auth.uid()) -- Admin kick/reject
);
