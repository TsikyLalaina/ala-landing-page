-- Create Badges table
CREATE TABLE IF NOT EXISTS public.badges (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text,
    icon text, -- Lucide icon name or custom identifier
    created_at timestamptz DEFAULT now()
);

-- Create User Badges join table
CREATE TABLE IF NOT EXISTS public.user_badges (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id uuid REFERENCES public.badges(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can view badges and who has them
CREATE POLICY "Badges are viewable by everyone" ON public.badges FOR SELECT USING (true);
CREATE POLICY "User badges are viewable by everyone" ON public.user_badges FOR SELECT USING (true);

-- Only Admins can manage user badges
CREATE POLICY "Admins can insert user badges" ON public.user_badges
FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can delete user badges" ON public.user_badges
FOR DELETE TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Insert default badges
INSERT INTO public.badges (name, description, icon)
VALUES 
    ('Mediator', 'Certified conflict mediator authorized to resolve grievances.', 'Shield'),
    ('Elder', 'Respected community elder with decision-making authority.', 'Award')
ON CONFLICT (name) DO NOTHING;
