-- Nuclear Fix for Infinite Recursion (42P17)
-- Switching to PL/PGSQL to prevent optimization inlining and ensure SECURITY DEFINER works as expected.

-- 1. DROP EVERYTHING (Policies and Functions)
DROP POLICY IF EXISTS "Groups are viewable by everyone" ON public.groups;
DROP POLICY IF EXISTS "Users can create groups" ON public.groups;
DROP POLICY IF EXISTS "Creators can update groups" ON public.groups;

DROP POLICY IF EXISTS "Group members are viewable by everyone" ON public.group_members;
DROP POLICY IF EXISTS "Group members visibility" ON public.group_members;
DROP POLICY IF EXISTS "view_group_members_policy" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "join_request_policy" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;
DROP POLICY IF EXISTS "leave_policy" ON public.group_members;
DROP POLICY IF EXISTS "Admins can update members" ON public.group_members;
DROP POLICY IF EXISTS "admin_update_policy" ON public.group_members;

DROP FUNCTION IF EXISTS public.has_group_access;
DROP FUNCTION IF EXISTS public.check_user_membership;

-- 2. Restate base Group policies (Simple, non-recursive)
CREATE POLICY "groups_select_policy" ON public.groups FOR SELECT USING (true);
CREATE POLICY "groups_insert_policy" ON public.groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "groups_update_policy" ON public.groups FOR UPDATE USING (auth.uid() = creator_id);

-- 3. Create Robust Security Helper Function (PLPGSQL)
CREATE OR REPLACE FUNCTION public.check_group_access(_group_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Direct query bypassing RLS
  RETURN EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = _group_id
    AND user_id = _user_id
    AND status IN ('admin', 'member')
  );
END;
$$;

-- 4. Create Group Members Policies using the Helper
CREATE POLICY "group_members_select_policy" ON public.group_members FOR SELECT
USING (
  -- Public groups: members list is visible (needed for counts)
  (SELECT is_public FROM public.groups WHERE id = group_members.group_id) = true
  OR
  -- Users see themselves
  user_id = auth.uid()
  OR
  -- Members/Admins see others (via safe function)
  public.check_group_access(group_members.group_id, auth.uid())
);

-- 5. Restore other Group Members policies
-- Join/Request
CREATE POLICY "group_members_insert_policy" ON public.group_members FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Leave
CREATE POLICY "group_members_delete_policy" ON public.group_members FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Admin Update (Approve/Ban)
CREATE POLICY "group_members_update_policy" ON public.group_members FOR UPDATE TO authenticated
USING (
  -- Only admins can update. Use valid admin check via safe function logic
  (
    SELECT role FROM public.group_members 
    WHERE group_id = group_members.group_id 
    AND user_id = auth.uid()
    LIMIT 1
  ) = 'admin'
  AND 
  public.check_group_access(group_members.group_id, auth.uid()) -- ensure they are actually a valid member/admin
);
