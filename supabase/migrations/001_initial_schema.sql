-- The Obsidian - Initial Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ucsfvzsiqkhusrecigwt/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PRICING CONFIGURATION TABLE (DYNAMIC PRICING)
-- ============================================================================
CREATE TABLE pricing_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  base_nightly_rate DECIMAL(10, 2) NOT NULL,
  cleaning_fee DECIMAL(10, 2) NOT NULL,
  service_fee_percentage DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
  tax_percentage DECIMAL(5, 2) NOT NULL DEFAULT 8.00,
  minimum_nights INTEGER NOT NULL DEFAULT 2,
  weekly_discount_percentage DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
  monthly_discount_percentage DECIMAL(5, 2) NOT NULL DEFAULT 20.00,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default pricing
INSERT INTO pricing_config (
  base_nightly_rate,
  cleaning_fee,
  service_fee_percentage,
  tax_percentage,
  minimum_nights,
  weekly_discount_percentage,
  monthly_discount_percentage
) VALUES (850.00, 150.00, 10.00, 8.00, 2, 10.00, 20.00);

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Dates & Guests
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INTEGER NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count >= 1 AND guest_count <= 4),
  
  -- Guest Information
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(50) NOT NULL,
  special_requests TEXT,
  
  -- Pricing Snapshot (captured at booking time)
  nightly_rate DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  cleaning_fee DECIMAL(10, 2) NOT NULL,
  service_fee DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Payment
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_intent_id VARCHAR(255),
  
  -- Agreements
  agreed_to_house_rules BOOLEAN NOT NULL DEFAULT false,
  agreed_to_cancellation_policy BOOLEAN NOT NULL DEFAULT false,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BLOCKED DATES TABLE
-- ============================================================================
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('booked', 'maintenance', 'personal', 'holiday')),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure dates are valid
  CHECK (end_date >= start_date)
);

-- Insert mock blocked dates from frontend
INSERT INTO blocked_dates (start_date, end_date, reason) VALUES
  ('2026-02-10', '2026-02-15', 'booked'),
  ('2026-02-20', '2026-02-22', 'maintenance'),
  ('2026-03-01', '2026-03-07', 'booked'),
  ('2026-03-15', '2026-03-20', 'personal'),
  ('2026-04-05', '2026-04-12', 'booked'),
  ('2026-04-25', '2026-04-28', 'holiday');

-- ============================================================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_email ON bookings(guest_email);
CREATE INDEX idx_blocked_dates_range ON blocked_dates(start_date, end_date);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_pricing_config_effective ON pricing_config(effective_from, effective_to);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to generate booking number
CREATE SEQUENCE booking_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_number := 'OBS-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('booking_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_number
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION generate_booking_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_config_updated_at
BEFORE UPDATE ON pricing_config
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blocked_dates_updated_at
BEFORE UPDATE ON blocked_dates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;

-- Public can read active pricing config
CREATE POLICY "Public can read active pricing config"
ON pricing_config FOR SELECT
USING (
  effective_from <= CURRENT_DATE AND 
  (effective_to IS NULL OR effective_to >= CURRENT_DATE)
);

-- Public can read blocked dates
CREATE POLICY "Public can read blocked dates"
ON blocked_dates FOR SELECT
USING (true);

-- Public can create bookings
CREATE POLICY "Public can create bookings"
ON bookings FOR INSERT
WITH CHECK (true);

-- Public can read their own bookings (for now allow all, add auth later)
CREATE POLICY "Public can read bookings"
ON bookings FOR SELECT
USING (true);

-- Public can create contact submissions
CREATE POLICY "Public can create contact submissions"
ON contact_submissions FOR INSERT
WITH CHECK (true);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the schema was created successfully:

-- Check tables
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check pricing config
-- SELECT * FROM pricing_config;

-- Check blocked dates
-- SELECT * FROM blocked_dates ORDER BY start_date;
