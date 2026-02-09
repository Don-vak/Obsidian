-- Add payment tracking fields to bookings table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ucsfvzsiqkhusrecigwt/sql

-- Add payment-related columns to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_payment_status TEXT DEFAULT 'pending' CHECK (stripe_payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Create index for faster payment intent lookups
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent 
ON bookings(stripe_payment_intent_id);

-- Create index for payment status queries
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status 
ON bookings(stripe_payment_status);

-- Add comment for documentation
COMMENT ON COLUMN bookings.stripe_payment_intent_id IS 'Stripe PaymentIntent ID for tracking payments';
COMMENT ON COLUMN bookings.stripe_payment_status IS 'Current status of the payment: pending, processing, paid, failed, or refunded';
COMMENT ON COLUMN bookings.paid_at IS 'Timestamp when payment was successfully completed';
