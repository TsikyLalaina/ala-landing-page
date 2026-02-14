-- Run this in your Supabase SQL Editor to add INSERT policy for users
-- This allows authenticated users to insert their own profile

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- Verify the policy was created
SELECT policyname, tablename, cmd 
FROM pg_policies 
WHERE tablename = 'users';
