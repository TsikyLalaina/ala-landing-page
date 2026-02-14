DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE tablename IN ('groups', 'group_members') -- Targets all policies on these tables
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- Drop all potentially conflicting helper functions
DROP FUNCTION IF EXISTS public.check_group_access;
DROP FUNCTION IF EXISTS public.check_user_membership;
DROP FUNCTION IF EXISTS public.has_group_access;

-- Create the NEW robust security definer function (PLPGSQL)
CREATE OR REPLACE FUNCTION public.check_group_membership_final(_group_id uuid, _user_id uuid)
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
    AND status IN ('admin', 'member')
  );
END;
$$;

-- Re-apply policies cleanly
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Groups Policies
CREATE POLICY "groups_select" ON public.groups FOR SELECT USING (true);
CREATE POLICY "groups_insert" ON public.groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "groups_update" ON public.groups FOR UPDATE USING (auth.uid() = creator_id);

-- Group Members Policies using the new function
CREATE POLICY "members_select" ON public.group_members FOR SELECT
USING (
  (SELECT is_public FROM public.groups WHERE id = group_members.group_id) = true
  OR
  user_id = auth.uid()
  OR
  public.check_group_membership_final(group_members.group_id, auth.uid())
);

CREATE POLICY "members_insert" ON public.group_members FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "members_delete" ON public.group_members FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "members_update" ON public.group_members FOR UPDATE TO authenticated
USING (
  public.check_group_membership_final(group_members.group_id, auth.uid())
  AND 
  (SELECT role FROM public.group_members WHERE group_id = group_members.group_id AND user_id = auth.uid()) = 'admin'
);
