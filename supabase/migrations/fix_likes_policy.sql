-- Enable Read access for Likes
CREATE POLICY "Anyone can view likes"
  ON likes FOR SELECT
  TO authenticated, anon
  USING (true);

-- Enable Read access for Comments (if not already fully covered)
-- Existing policy was for 'authenticated', ensure it covers what we need.

-- Ensure posts are visible
-- Existing policy "Authenticated users view all posts" covers authenticated.
-- If we want public feed later, we might need anon access, but for now authenticated is fine.

-- Make sure users table is readable (it has a policy, but ensure it works for joins)
-- "Public can view basic user profiles" is already there.

-- Grant select on all tables to anon/authenticated just in case for now during dev? 
-- No, better to be specific.
