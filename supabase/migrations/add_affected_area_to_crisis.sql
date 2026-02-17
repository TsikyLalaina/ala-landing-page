-- Add affected_area column to crisis_alerts table
ALTER TABLE public.crisis_alerts 
ADD COLUMN IF NOT EXISTS affected_area text;
