import { z } from 'zod';

export const CreatePaymentIntentSchema = z.object({
    checkIn: z.string().min(1, "Check-in date is required"),
    checkOut: z.string().min(1, "Check-out date is required"),
    guests: z.number().int().min(1, "At least 1 guest is required"),
    totalAmount: z.number().positive("Total amount must be positive"),
    guestName: z.string().min(1, "Guest name is required"),
    guestEmail: z.string().email("Invalid email address"),
    guestPhone: z.string().optional(),
    specialRequests: z.string().optional(),
    tripPurpose: z.string().optional(),
    arrivalTime: z.string().optional(),
    verificationSessionId: z.string().optional(),
});

export const CreateDepositHoldSchema = z.object({
    paymentMethodId: z.string().min(1, "Payment Method ID is required"),
    paymentIntentId: z.string().min(1, "Payment Intent ID is required"),
});

export type CreatePaymentIntentInput = z.infer<typeof CreatePaymentIntentSchema>;
export type CreateDepositHoldInput = z.infer<typeof CreateDepositHoldSchema>;

export const ContactSubmissionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional().nullable(),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
});

export const CreateVerificationSessionSchema = z.object({
    guestName: z.string().min(1, "Guest name is required"),
    guestEmail: z.string().email("Invalid email address"),
    bookingMetadata: z.record(z.string(), z.any()).optional(),
});

export const CreateBookingSchema = z.object({
    checkIn: z.string().min(1, "Check-in date is required"),
    checkOut: z.string().min(1, "Check-out date is required"),
    guestCount: z.number().int().min(1, "At least 1 guest is required"),
    guestName: z.string().min(1, "Guest name is required"),
    guestEmail: z.string().email("Invalid email address"),
    guestPhone: z.string().optional(),
    specialRequests: z.string().optional(),
    agreeToHouseRules: z.boolean().refine(val => val === true, "Must agree to house rules"),
    agreeToCancellationPolicy: z.boolean().refine(val => val === true, "Must agree to cancellation policy"),
});
