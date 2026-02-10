-- Make guest_phone nullable since it's optional in the booking form
ALTER TABLE bookings 
ALTER COLUMN guest_phone DROP NOT NULL;

COMMENT ON COLUMN bookings.guest_phone IS 'Guest phone number (optional)';
