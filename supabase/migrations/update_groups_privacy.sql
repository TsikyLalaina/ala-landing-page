-- 1. Add status column to group_members for pending requests
-- status can be 'member', 'admin', 'pending', 'invited'
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS status text DEFAULT 'member';

-- 2. Add invitation_code to groups
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS invitation_code text DEFAULT substring(md5(random()::text), 1, 8) UNIQUE;

-- 3. Update RLS policies to handle private groups and invitations

-- Groups: Private groups are visible, but content might be restricted (handled in app logic or separate RLS)
-- For now, we allow viewing the group existence.

-- Group Members:
-- - Admins can view all members (including pending)
-- - Members can view other confirmed members
-- - Users can view their own membership status
DROP POLICY IF EXISTS "Group members are viewable by everyone" ON public.group_members;
CREATE POLICY "Group members visibility" ON public.group_members FOR SELECT
USING (
  (SELECT is_public FROM public.groups WHERE id = group_members.group_id) = true -- Public groups' members are visible
  OR
  user_id = auth.uid() -- Users can see their own
  OR
  EXISTS ( -- Admins/Members of the group can see others
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_members.group_id
    AND gm.user_id = auth.uid()
    AND gm.status IN ('admin', 'member')
  )
);

-- Joining:
-- - Public: Insert with status 'member' (handled by frontend logic, defaulting to 'member' in DB is ok if we override)
-- - Private: Insert with status 'pending' (User requests to join)
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
CREATE POLICY "Users can request to join" ON public.group_members FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  -- We allow users to insert themselves. The status ('pending' or 'member') will be controlled by the frontend/API 
  -- or strictly by a trigger if we wanted strict enforcement. For now, we trust the client to send 'pending' for private.
);

-- Updating:
-- - Admins can update status (approve pending, promote/demote)
CREATE POLICY "Admins can update members" ON public.group_members FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_members.group_id
    AND gm.user_id = auth.uid()
    AND gm.role = 'admin'
    AND gm.status = 'admin' -- operational status check
  )
);

-- 4. Function to generate/reset invitation code (Optional, can be done via client update)
