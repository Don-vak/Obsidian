import { z } from 'zod';

export const bookingFormSchema = z.object({
    // Step 1: Dates & Guests
    checkIn: z.string().min(1, 'Check-in date is required'),
    checkOut: z.string().min(1, 'Check-out date is required'),
    guestCount: z.number().min(1, 'At least 1 guest required').max(4, 'Maximum 4 guests allowed'),

    // Step 2: Guest Information + Soft Screening
    guestName: z.string().min(2, 'Name must be at least 2 characters'),
    guestEmail: z.string().email('Invalid email address'),
    guestPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
    specialRequests: z.string().optional(),
    tripPurpose: z.string().optional(),
    arrivalTime: z.string().optional(),

    // Step 3: Review & Confirm + Rental Agreement
    agreeToHouseRules: z.boolean().refine(val => val === true, {
        message: 'You must agree to the house rules',
    }),
    agreeToCancellationPolicy: z.boolean().refine(val => val === true, {
        message: 'You must agree to the cancellation policy',
    }),
    agreeToRentalAgreement: z.boolean().refine(val => val === true, {
        message: 'You must agree to the rental agreement',
    }),

    // Step 4: Identity Verification (handled separately via Stripe Identity)
    // Step 5: Payment (handled via Stripe Elements)
    cardNumber: z.string().min(16, 'Card number must be 16 digits').max(19, 'Invalid card number'),
    cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Expiry must be in MM/YY format'),
    cardCvv: z.string().min(3, 'CVV must be 3 digits').max(4, 'CVV must be 3-4 digits'),
    cardName: z.string().min(2, 'Cardholder name is required'),
    billingAddress: z.string().min(5, 'Billing address is required'),
    billingCity: z.string().min(2, 'City is required'),
    billingZip: z.string().min(5, 'ZIP code is required'),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
