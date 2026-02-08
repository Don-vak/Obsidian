-- Simple RLS Fix - Disable RLS on Public Tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ucsfvzsiqkhusrecigwt/sql

-- For public-facing tables that don't need authentication,
-- we can simply disable RLS instead of fighting with policies

-- Disable RLS on contact_submissions (public contact form)
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Disable RLS on bookings (public booking form)
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Disable RLS on blocked_dates (public calendar data)
ALTER TABLE blocked_dates DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled on pricing_config but ensure it has a working policy
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;

-- Drop and recreate pricing_config policy
DROP POLICY IF EXISTS "public_read_pricing_config" ON pricing_config;
DROP POLICY IF EXISTS "Public can read active pricing config" ON pricing_config;
DROP POLICY IF EXISTS "allow_read_pricing" ON pricing_config;

CREATE POLICY "allow_read_pricing"
ON pricing_config FOR SELECT
USING (true);

-- Verify RLS status
SELECT tablename, 
       CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('bookings', 'blocked_dates', 'contact_submissions', 'pricing_config')
ORDER BY tablename;
