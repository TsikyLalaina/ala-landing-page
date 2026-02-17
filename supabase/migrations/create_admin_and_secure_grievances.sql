-- Create Admin Users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) NOT NULL UNIQUE,
    role text DEFAULT 'admin',
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admins are viewable by everyone (so UI can check if current user is admin)
CREATE POLICY "Admins are viewable by everyone" ON public.admin_users FOR SELECT USING (true);

-- Only service role can insert admins (manually for now)
-- (No insert policy for authenticated users)

-- UPDATE GRIEVANCE POLICIES --

-- Drop the "open" view policy
DROP POLICY IF EXISTS "View grievances" ON public.grievances;

-- Create strict view policy
-- Visible to: Reporter, Respondent (User), Mediator, Group Members (if Respondent is Group), and Admins
CREATE POLICY "View grievances strict" ON public.grievances
FOR SELECT TO authenticated
USING (
    auth.uid() = reporter_id OR 
    auth.uid() = against_user_id OR 
    auth.uid() = mediator_id OR
    -- Check if user is an admin
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()) OR
    -- Check if user is member of the respondent group
    (group_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = grievances.group_id AND user_id = auth.uid()
    ))
);

-- Update Update Policy (Only Mediators and Admins can update status/assign)
-- Reporters can update description if Open? (Maybe later)
DROP POLICY IF EXISTS "Update grievances" ON public.grievances;
-- Assuming there was one? If not, we create one.
-- Existing might be implicit or none.

CREATE POLICY "Update grievances strict" ON public.grievances
FOR UPDATE TO authenticated
USING (
    -- Users can only update rows they are involved in (limit columns via UI/API, but RLS is row-level)
    auth.uid() = mediator_id OR
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
)
WITH CHECK (
    auth.uid() = mediator_id OR
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- RESOLUTION NOTES POLICIES --

-- Drop old if exists (likely standard "Users can insert their own note")
-- We need to restrict INSERT based on relation to grievance
DROP POLICY IF EXISTS "Insert resolution notes" ON public.resolution_notes;

CREATE POLICY "Insert resolution notes strict" ON public.resolution_notes
FOR INSERT TO authenticated
WITH CHECK (
    auth.uid() = author_id AND (
        -- Must be involved in the linked grievance or Admin
        EXISTS (
            SELECT 1 FROM public.grievances g
            WHERE g.id = grievance_id AND (
                g.reporter_id = auth.uid() OR
                g.against_user_id = auth.uid() OR
                g.mediator_id = auth.uid() OR
                EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()) OR
                 (g.group_id IS NOT NULL AND EXISTS (
                    SELECT 1 FROM public.group_members 
                    WHERE group_id = g.group_id AND user_id = auth.uid()
                ))
            )
        )
    )
);

-- Insert current user as Admin for testing (Optional: You might want to remove this in prod)
-- This attempts to make the first user found in auth.users or public.users an admin if table is empty.
-- Since we can't easily access auth.uid() in a migration script effectively without a session, 
-- we rely on manual insertion or a seed script. 
-- However, for your development comfort, we can try to insert YOU if we knew your ID.
-- Since I don't, I will rely on you adding a row to `admin_users` manually via Supabase dashboard 
-- OR checking the console log I'll add to the frontend.
