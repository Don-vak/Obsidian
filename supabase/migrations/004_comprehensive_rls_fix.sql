-- Comprehensive RLS Policy Fix
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ucsfvzsiqkhusrecigwt/sql

-- First, let's check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('bookings', 'blocked_dates', 'contact_submissions', 'pricing_config')
ORDER BY tablename, policyname;

-- Now let's drop ALL existing policies and recreate them properly
-- ============================================================================
-- PRICING CONFIG TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Public can read active pricing config" ON pricing_config;

CREATE POLICY "public_read_pricing_config"
ON pricing_config FOR SELECT
TO public
USING (
  effective_from <= CURRENT_DATE AND 
  (effective_to IS NULL OR effective_to >= CURRENT_DATE)
);

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;
DROP POLICY IF EXISTS "Public can read bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public to create bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public to read bookings" ON bookings;

CREATE POLICY "public_insert_bookings"
ON bookings FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "public_select_bookings"
ON bookings FOR SELECT
TO public
USING (true);

-- ============================================================================
-- BLOCKED DATES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Public can read blocked dates" ON blocked_dates;
DROP POLICY IF EXISTS "Service can insert blocked dates" ON blocked_dates;
DROP POLICY IF EXISTS "Allow public to read blocked dates" ON blocked_dates;
DROP POLICY IF EXISTS "Allow public to insert blocked dates" ON blocked_dates;

CREATE POLICY "public_select_blocked_dates"
ON blocked_dates FOR SELECT
TO public
USING (true);

CREATE POLICY "public_insert_blocked_dates"
ON blocked_dates FOR INSERT
TO public
WITH CHECK (true);

-- ============================================================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Public can create contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public to create contact submissions" ON contact_submissions;

CREATE POLICY "public_insert_contact_submissions"
ON contact_submissions FOR INSERT
TO public
WITH CHECK (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('bookings', 'blocked_dates', 'contact_submissions', 'pricing_config')
ORDER BY tablename, policyname;
