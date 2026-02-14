-- Compliance Logs Table
CREATE TABLE IF NOT EXISTS public.compliance_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    activity_type text NOT NULL, -- 'consultation', 'inspection', 'training', 'other'
    description text NOT NULL, -- The logged text (voice-to-text output)
    flags text[], -- ['grant_issue', 'urgent', 'compliance_violation']
    language text DEFAULT 'en', -- 'en', 'mg', 'fr'
    location text,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- RLS
ALTER TABLE public.compliance_logs ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view own logs" ON public.compliance_logs;
DROP POLICY IF EXISTS "Users can create logs" ON public.compliance_logs;

CREATE POLICY "Users can view own logs" ON public.compliance_logs
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create logs" ON public.compliance_logs
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
