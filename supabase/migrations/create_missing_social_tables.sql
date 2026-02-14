-- Create Messages Table (New)
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- RLS for Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);


-- Create Events Table (New)
CREATE TABLE IF NOT EXISTS public.events (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    organizer_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    location text,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    image_url text,
    is_virtual boolean DEFAULT false,
    meeting_link text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- RLS for Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
CREATE POLICY "Anyone can view events" ON public.events
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can create events" ON public.events;
CREATE POLICY "Users can create events" ON public.events
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Organizers can update own events" ON public.events;
CREATE POLICY "Organizers can update own events" ON public.events
    FOR UPDATE TO authenticated USING (auth.uid() = organizer_id);


-- Create Event Participants Table (New)
CREATE TABLE IF NOT EXISTS public.event_participants (
    event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    status text DEFAULT 'going', -- 'going', 'interested', 'maybe'
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (event_id, user_id)
);

-- RLS for Event Participants
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view event participants" ON public.event_participants;
CREATE POLICY "Anyone can view event participants" ON public.event_participants
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can join events" ON public.event_participants;
CREATE POLICY "Users can join events" ON public.event_participants
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their participation" ON public.event_participants;
CREATE POLICY "Users can update their participation" ON public.event_participants
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave events" ON public.event_participants;
CREATE POLICY "Users can leave events" ON public.event_participants
    FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- Setup RLS for existing Follows table
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view follows" ON public.follows;
CREATE POLICY "Anyone can view follows" ON public.follows
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can follow others" ON public.follows;
CREATE POLICY "Users can follow others" ON public.follows
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow" ON public.follows;
CREATE POLICY "Users can unfollow" ON public.follows
    FOR DELETE TO authenticated USING (auth.uid() = follower_id);
