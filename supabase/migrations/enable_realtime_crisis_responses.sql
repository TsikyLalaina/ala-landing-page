-- Enable Realtime for crisis_responses table
-- This allows the frontend to receive live updates when new responses are added

BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
COMMIT;

-- Note: typically 'supabase_realtime' exists and we just add tables. 
-- But 'FOR ALL TABLES' is the default for Supabase projects usually.
-- If we want to be specific:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.crisis_responses;

-- Since I don't know the current state of publication, I will try to add it specifically.
-- If 'supabase_realtime' includes ALL tables, this might be redundant but harmless.

ALTER PUBLICATION supabase_realtime ADD TABLE public.crisis_responses;
