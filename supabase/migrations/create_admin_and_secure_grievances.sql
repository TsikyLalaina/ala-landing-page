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
-- Visible to: Everyone (if Resolved), or Involved Parties/Admins (if Active)
CREATE POLICY "View grievances strict" ON public.grievances
FOR SELECT TO authenticated
USING (
    status = 'resolved' OR -- Resolved grievances are public
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
DROP POLICY IF EXISTS "Update grievances" ON public.grievances;

CREATE POLICY "Update grievances strict" ON public.grievances
FOR UPDATE TO authenticated
USING (
    -- Users can only update rows they are involved in
    auth.uid() = mediator_id OR
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
)
WITH CHECK (
    auth.uid() = mediator_id OR
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- RESOLUTION NOTES POLICIES --

-- Drop old policies
DROP POLICY IF EXISTS "View resolution notes" ON public.resolution_notes;
DROP POLICY IF EXISTS "Insert resolution notes" ON public.resolution_notes;

-- View Policy: Visible if linked grievance is visible (or resolved)
CREATE POLICY "View resolution notes strict" ON public.resolution_notes
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.grievances g
        WHERE g.id = resolution_notes.grievance_id AND (
            g.status = 'resolved' OR
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
);

-- Insert Policy: Only involved parties can add notes
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

-- VOTES POLICIES should also be restricted ideally
DROP POLICY IF EXISTS "View grievance votes" ON public.grievance_votes;

CREATE POLICY "View grievance votes strict" ON public.grievance_votes
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.grievances g
        WHERE g.id = grievance_votes.grievance_id AND (
            g.status = 'resolved' OR
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
);
