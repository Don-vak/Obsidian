-- Add security deposit hold tracking columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deposit_intent_id TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deposit_status TEXT DEFAULT 'none' CHECK (deposit_status IN ('none', 'held', 'released', 'captured', 'failed'));
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deposit_captured_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deposit_updated_at TIMESTAMPTZ;
