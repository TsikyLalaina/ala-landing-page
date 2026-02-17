-- Enhance grievances workflow — full mediation + resolution support

-- Add resolution/escalation columns
ALTER TABLE public.grievances 
  ADD COLUMN IF NOT EXISTS resolution_text text,
  ADD COLUMN IF NOT EXISTS resolved_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES public.groups(id),
  ADD COLUMN IF NOT EXISTS escalated boolean DEFAULT false;

-- Add evidence_urls to resolution_notes for counter-evidence
ALTER TABLE public.resolution_notes
  ADD COLUMN IF NOT EXISTS evidence_urls text[];

-- Update categories: include mining-specific disputes
-- (categories are stored as free-text, so no migration needed —
--  just ensure the UI offers the expanded list)
