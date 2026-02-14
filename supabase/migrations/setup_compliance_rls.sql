-- Enable RLS for existing compliance_logs table
ALTER TABLE public.compliance_logs ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view own logs" ON public.compliance_logs;
DROP POLICY IF EXISTS "Users can create logs" ON public.compliance_logs;

CREATE POLICY "Users can view own logs" ON public.compliance_logs
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create logs" ON public.compliance_logs
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
