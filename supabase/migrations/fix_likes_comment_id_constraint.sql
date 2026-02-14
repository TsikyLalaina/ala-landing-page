-- Make comment_id nullable in likes table to allow liking posts without a comment_id
ALTER TABLE likes ALTER COLUMN comment_id DROP NOT NULL;
