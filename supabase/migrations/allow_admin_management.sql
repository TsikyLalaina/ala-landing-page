-- Allow Admins to Delete Members (Refuse join requests or Remove users)
-- This policy was missing in the previous reset, restricting deletes to self-only.

CREATE POLICY "admins_delete_members_policy" ON public.group_members FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_members.group_id -- Target group
    AND gm.user_id = auth.uid() -- Current user
    AND gm.role = 'admin' -- Is Admin
    AND gm.status IN ('admin', 'member') -- Is Active
  )
);

-- Ensure Admins can Update Members (Accept join requests)
-- (This might duplicate slightly depending on previous runs, but 'create policy if not exists' isn't standard SQL)
-- We'll drop and recreate the update policy to be safe and robust.

DROP POLICY IF EXISTS "group_members_update_policy" ON public.group_members;

CREATE POLICY "group_members_update_policy" ON public.group_members FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_members.group_id
    AND gm.user_id = auth.uid()
    AND gm.role = 'admin'
    AND gm.status IN ('admin', 'member')
  )
);
