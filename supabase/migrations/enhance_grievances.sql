-- Enhance grievances table for conflict resolution

-- Add missing columns
ALTER TABLE public.grievances 
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS mediator_id uuid REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Convert status to text if it's an enum
ALTER TABLE public.grievances 
  ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.grievances 
  ALTER COLUMN status TYPE text USING status::text;
ALTER TABLE public.grievances 
  ALTER COLUMN status SET DEFAULT 'open';

-- Resolution Notes table (tracks each step of mediation)
CREATE TABLE IF NOT EXISTS public.resolution_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  grievance_id uuid REFERENCES public.grievances(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  note_type text DEFAULT 'note', -- 'note', 'mediation', 'decision', 'escalation'
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Community votes on grievances
CREATE TABLE IF NOT EXISTS public.grievance_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  grievance_id uuid REFERENCES public.grievances(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  vote text NOT NULL, -- 'support_reporter', 'support_respondent', 'neutral'
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(grievance_id, user_id) -- One vote per user per grievance
);

-- Enable RLS
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resolution_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievance_votes ENABLE ROW LEVEL SECURITY;

-- Grievances Policies
DROP POLICY IF EXISTS "View grievances" ON public.grievances;
DROP POLICY IF EXISTS "Create grievances" ON public.grievances;
DROP POLICY IF EXISTS "Update own grievances" ON public.grievances;
DROP POLICY IF EXISTS "Mediator update grievances" ON public.grievances;

-- Authenticated users can view all open grievances (transparency for community)
CREATE POLICY "View grievances" ON public.grievances
FOR SELECT TO authenticated USING (true);

-- Users can file grievances
CREATE POLICY "Create grievances" ON public.grievances
FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);

-- Reporter, respondent, or mediator can update
CREATE POLICY "Update grievances" ON public.grievances
FOR UPDATE TO authenticated USING (
  auth.uid() = reporter_id OR 
  auth.uid() = against_user_id OR 
  auth.uid() = mediator_id
);

-- Resolution Notes Policies
DROP POLICY IF EXISTS "View resolution notes" ON public.resolution_notes;
DROP POLICY IF EXISTS "Create resolution notes" ON public.resolution_notes;

CREATE POLICY "View resolution notes" ON public.resolution_notes
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Create resolution notes" ON public.resolution_notes
FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

-- Grievance Votes Policies
DROP POLICY IF EXISTS "View grievance votes" ON public.grievance_votes;
DROP POLICY IF EXISTS "Cast grievance vote" ON public.grievance_votes;

CREATE POLICY "View grievance votes" ON public.grievance_votes
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Cast grievance vote" ON public.grievance_votes
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Storage bucket for grievance evidence
INSERT INTO storage.buckets (id, name, public)
VALUES ('grievances', 'grievances', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Grievance evidence is viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'grievances');

CREATE POLICY "Users can upload grievance evidence" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'grievances');
