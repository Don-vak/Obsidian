import { z } from 'zod';

export const bookingFormSchema = z.object({
    // Step 1: Dates & Guests
    checkIn: z.string().min(1, 'Check-in date is required'),
    checkOut: z.string().min(1, 'Check-out date is required'),
    guestCount: z.number().min(1, 'At least 1 guest required').max(4, 'Maximum 4 guests allowed'),

    // Step 2: Guest Information
    guestName: z.string().min(2, 'Name must be at least 2 characters'),
    guestEmail: z.string().email('Invalid email address'),
    guestPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
    specialRequests: z.string().optional(),

    // Step 3: Agreements
    agreeToHouseRules: z.boolean().refine(val => val === true, {
        message: 'You must agree to the house rules',
    }),
    agreeToCancellationPolicy: z.boolean().refine(val => val === true, {
        message: 'You must agree to the cancellation policy',
    }),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
