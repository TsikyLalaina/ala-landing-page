-- Fix security flaw where pending group members can access group grievances

-- 1. View Grievances
DROP POLICY IF EXISTS "View grievances strict" ON public.grievances;
CREATE POLICY "View grievances strict" ON public.grievances
FOR SELECT TO authenticated
USING (
    status = 'resolved' OR 
    auth.uid() = reporter_id OR 
    auth.uid() = against_user_id OR 
    auth.uid() = mediator_id OR
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()) OR
    (group_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = grievances.group_id 
        AND user_id = auth.uid()
        AND status IN ('member', 'admin')
    ))
);

-- 2. View Resolution Notes
DROP POLICY IF EXISTS "View resolution notes strict" ON public.resolution_notes;
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
                WHERE group_id = g.group_id 
                AND user_id = auth.uid()
                AND status IN ('member', 'admin')
            ))
        )
    )
);

-- 3. Insert Resolution Notes (Pending members definitely shouldn't post)
DROP POLICY IF EXISTS "Insert resolution notes strict" ON public.resolution_notes;
CREATE POLICY "Insert resolution notes strict" ON public.resolution_notes
FOR INSERT TO authenticated
WITH CHECK (
    auth.uid() = author_id AND (
        EXISTS (
            SELECT 1 FROM public.grievances g
            WHERE g.id = grievance_id AND (
                g.reporter_id = auth.uid() OR
                g.against_user_id = auth.uid() OR
                g.mediator_id = auth.uid() OR
                EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()) OR
                 (g.group_id IS NOT NULL AND EXISTS (
                    SELECT 1 FROM public.group_members 
                    WHERE group_id = g.group_id 
                    AND user_id = auth.uid()
                    AND status IN ('member', 'admin')
                ))
            )
        )
    )
);

-- 4. View Votes
DROP POLICY IF EXISTS "View grievance votes strict" ON public.grievance_votes;
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
                WHERE group_id = g.group_id 
                AND user_id = auth.uid()
                AND status IN ('member', 'admin')
            ))
        )
    )
);
