-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sector_type') THEN
        CREATE TYPE sector_type AS ENUM ('agriculture', 'mining', 'both', 'other');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resource_type') THEN
        CREATE TYPE resource_type AS ENUM ('tutorial', 'video', 'quiz', 'pdf', 'other');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status') THEN
        CREATE TYPE listing_status AS ENUM ('active', 'sold', 'expired', 'draft');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grievance_status') THEN
        CREATE TYPE grievance_status AS ENUM ('open', 'in_review', 'resolved', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_severity') THEN
        CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
    END IF;
END $$;

-- 1. Users & Profiles
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    name TEXT NOT NULL,
    username TEXT UNIQUE,
    avatar_url TEXT,                    -- Supabase Storage path
    bio TEXT,
    location TEXT,                      -- e.g., "Anosy", or geo JSON later
    sector sector_type NOT NULL DEFAULT 'agriculture',
    interests TEXT[],                   -- array of tags e.g. ['vanilla', 'graphite']
    badges TEXT[],                      -- e.g. ['Regenerative Expert', 'Mediator']
    referral_code TEXT UNIQUE GENERATED ALWAYS AS (substring(md5(id::text), 1, 8)) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_timestamp ON users;
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 2. Follows (user follows user)
CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

-- 3. Posts
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT[],                  -- array of Storage paths
    hashtags TEXT[],
    category TEXT,                      -- e.g. 'DroughtResilience', 'MineWasteRecycling'
    location TEXT,
    is_emergency BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

DROP TRIGGER IF EXISTS update_posts_timestamp ON posts;
CREATE TRIGGER update_posts_timestamp
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- 4. Comments (threaded)
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,  -- for replies
    content TEXT NOT NULL,
    media_urls TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_comments_timestamp ON comments;
CREATE TRIGGER update_comments_timestamp
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- 5. Likes (on posts & comments)
CREATE TABLE IF NOT EXISTS likes (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    ),
    PRIMARY KEY (user_id, post_id, comment_id)
);

-- 6. Groups / Projects
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_members (
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',          -- e.g. 'admin', 'moderator'
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

-- 7. Votes (project decisions, resolutions)
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,  -- or grievance
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    vote_value INTEGER NOT NULL CHECK (vote_value IN (-1, 0, 1)),  -- down/neutral/up or yes/no/abstain
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, group_id, post_id)  -- one vote per user per item
);

-- 8. Marketplace Listings
CREATE TABLE IF NOT EXISTS marketplace_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12,2),
    currency TEXT DEFAULT 'MGA',
    quantity DECIMAL,
    status listing_status DEFAULT 'active',
    media_urls TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    sold_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES marketplace_listings(id) ON DELETE CASCADE NOT NULL,
    bidder_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Resources / Tutorials
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content_url TEXT,                   -- video/embed/storage path
    type resource_type NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Grievances / Conflicts
CREATE TABLE IF NOT EXISTS grievances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    against_user_id UUID REFERENCES users(id),
    group_id UUID REFERENCES groups(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_urls TEXT[],
    status grievance_status DEFAULT 'open',
    resolution_text TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Crisis Alerts
CREATE TABLE IF NOT EXISTS crisis_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity alert_severity NOT NULL,
    location TEXT,
    affected_areas JSONB,               -- geo data if needed
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Regulatory / Compliance Logs
CREATE TABLE IF NOT EXISTS compliance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL,        -- e.g. 'consultation', 'offset'
    details JSONB,
    evidence_urls TEXT[],
    report_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Referrals (tracking)
CREATE TABLE IF NOT EXISTS referrals (
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (referrer_id, referred_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users: Only authenticated users can read public profiles; users can update/insert their own
DROP POLICY IF EXISTS "Public can view basic user profiles" ON users;
CREATE POLICY "Public can view basic user profiles" ON users FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Posts: Authenticated users can read all (for feed); only owners can create/update/delete
DROP POLICY IF EXISTS "Authenticated users view all posts" ON posts;
CREATE POLICY "Authenticated users view all posts" ON posts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Users create own posts" ON posts;
CREATE POLICY "Users create own posts" ON posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users update own posts" ON posts;
CREATE POLICY "Users update own posts" ON posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users delete own posts" ON posts;
CREATE POLICY "Users delete own posts" ON posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Comments: Similar to posts
DROP POLICY IF EXISTS "Authenticated view comments" ON comments;
CREATE POLICY "Authenticated view comments" ON comments FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Users create own comments" ON comments;
CREATE POLICY "Users create own comments" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Likes/Follows: Authenticated can insert; read is open for counts
DROP POLICY IF EXISTS "Authenticated can like" ON likes;
CREATE POLICY "Authenticated can like" ON likes FOR INSERT TO authenticated WITH CHECK (true);

-- Groups: Members can read; creator/admins manage
DROP POLICY IF EXISTS "Group members view group" ON groups;
CREATE POLICY "Group members view group" ON groups FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM group_members WHERE group_id = groups.id AND user_id = auth.uid())
);

-- Marketplace: Listings public read; owners manage
DROP POLICY IF EXISTS "Public view listings" ON marketplace_listings;
CREATE POLICY "Public view listings" ON marketplace_listings FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Owners manage own listings" ON marketplace_listings;
CREATE POLICY "Owners manage own listings" ON marketplace_listings FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Resources: Public read approved ones; creators upload
DROP POLICY IF EXISTS "Public view approved resources" ON resources;
CREATE POLICY "Public view approved resources" ON resources FOR SELECT TO authenticated USING (approved = true);
DROP POLICY IF EXISTS "Users create resources" ON resources;
CREATE POLICY "Users create resources" ON resources FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Grievances: Reporter and involved parties can read/update
DROP POLICY IF EXISTS "Reporter views own grievance" ON grievances;
CREATE POLICY "Reporter views own grievance" ON grievances FOR SELECT TO authenticated USING (reporter_id = auth.uid());
