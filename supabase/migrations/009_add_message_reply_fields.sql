-- Add admin reply tracking columns to contact_submissions
-- Run this in Supabase SQL Editor

ALTER TABLE contact_submissions
ADD COLUMN IF NOT EXISTS admin_reply TEXT,
ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
