-- Allow UPDATE and INSERT on pricing_config for the service role
-- Run this in Supabase SQL Editor

-- Add UPDATE policy for pricing_config
DROP POLICY IF EXISTS "allow_update_pricing" ON pricing_config;
CREATE POLICY "allow_update_pricing"
ON pricing_config FOR UPDATE
USING (true)
WITH CHECK (true);

-- Add INSERT policy for pricing_config (for new configs)
DROP POLICY IF EXISTS "allow_insert_pricing" ON pricing_config;
CREATE POLICY "allow_insert_pricing"
ON pricing_config FOR INSERT
WITH CHECK (true);

-- Verify policies
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'pricing_config';
