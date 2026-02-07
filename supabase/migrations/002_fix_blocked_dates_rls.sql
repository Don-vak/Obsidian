-- Fix RLS Policy for blocked_dates table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ucsfvzsiqkhusrecigwt/sql

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Public can read blocked dates" ON blocked_dates;

-- Create new policies that allow both reading and inserting
CREATE POLICY "Public can read blocked dates"
ON blocked_dates FOR SELECT
USING (true);

CREATE POLICY "Service can insert blocked dates"
ON blocked_dates FOR INSERT
WITH CHECK (true);

-- This allows the API (using the anon key) to create blocked dates when bookings are made
