-- ================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Add latitude and longitude columns for location sync
-- ================================================

-- Add location coordinates columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11,8);

-- Optional: Add index for geospatial queries if needed later
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location_lat, location_lng);
