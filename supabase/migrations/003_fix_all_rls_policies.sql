-- Fix RLS Policies for Public Access
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ucsfvzsiqkhusrecigwt/sql

-- This fixes the RLS policies to allow the public API to:
-- 1. Create bookings
-- 2. Create blocked dates (when bookings are made)
-- 3. Submit contact forms

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;
DROP POLICY IF EXISTS "Public can read bookings" ON bookings;

CREATE POLICY "Allow public to create bookings"
ON bookings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public to read bookings"
ON bookings FOR SELECT
USING (true);

-- ============================================================================
-- BLOCKED DATES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Public can read blocked dates" ON blocked_dates;
DROP POLICY IF EXISTS "Service can insert blocked dates" ON blocked_dates;

CREATE POLICY "Allow public to read blocked dates"
ON blocked_dates FOR SELECT
USING (true);

CREATE POLICY "Allow public to insert blocked dates"
ON blocked_dates FOR INSERT
WITH CHECK (true);

-- ============================================================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Public can create contact submissions" ON contact_submissions;

CREATE POLICY "Allow public to create contact submissions"
ON contact_submissions FOR INSERT
WITH CHECK (true);
