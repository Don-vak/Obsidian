import { resend } from './client';
import { BookingConfirmationEmail } from './templates/booking-confirmation';
import { AdminBookingNotification } from './templates/admin-booking-notification';
import { ContactFormNotification } from './templates/contact-form-notification';

const FROM_EMAIL = 'The Obsidian <onboarding@resend.dev>'; // Use your verified domain in production
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'toyursi@gmail.com';

interface Booking {
    booking_number: string;
    guest_name: string;
    guest_email: string;
    guest_phone?: string;
    check_in: string;
    check_out: string;
    nights: number;
    guest_count: number;
    nightly_rate: number;
    subtotal: number;
    discount: number;
    cleaning_fee: number;
    service_fee: number;
    tax_amount: number;
    total: number;
}

interface ContactSubmission {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    created_at: string;
}

/**
 * Send booking confirmation email to guest
 */
export async function sendBookingConfirmation(booking: Booking) {
    try {
        const emailHtml = BookingConfirmationEmail({
            bookingNumber: booking.booking_number,
            guestName: booking.guest_name,
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            nights: booking.nights,
            guestCount: booking.guest_count,
            nightlyRate: Number(booking.nightly_rate),
            subtotal: Number(booking.subtotal),
            discount: Number(booking.discount),
            cleaningFee: Number(booking.cleaning_fee),
            serviceFee: Number(booking.service_fee),
            taxAmount: Number(booking.tax_amount),
            total: Number(booking.total),
        });

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: booking.guest_email,
            subject: `Booking Confirmed - The Obsidian #${booking.booking_number}`,
            html: emailHtml,
        });

        if (error) {
            console.error('Error sending booking confirmation:', error);
            throw error;
        }

        console.log('Booking confirmation sent:', data);
        return data;
    } catch (error) {
        console.error('Failed to send booking confirmation:', error);
        // Don't throw - we don't want email failures to break the booking process
        return null;
    }
}

/**
 * Send booking notification to admin
 */
export async function sendAdminBookingNotification(booking: Booking) {
    try {
        const emailHtml = AdminBookingNotification({
            bookingNumber: booking.booking_number,
            guestName: booking.guest_name,
            guestEmail: booking.guest_email,
            guestPhone: booking.guest_phone,
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            nights: booking.nights,
            guestCount: booking.guest_count,
            total: Number(booking.total),
        });

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `New Booking - ${booking.booking_number}`,
            html: emailHtml,
        });

        if (error) {
            console.error('Error sending admin notification:', error);
            throw error;
        }

        console.log('Admin notification sent:', data);
        return data;
    } catch (error) {
        console.error('Failed to send admin notification:', error);
        return null;
    }
}

/**
 * Send contact form notification to admin
 */
export async function sendContactFormNotification(submission: ContactSubmission) {
    try {
        const emailHtml = ContactFormNotification({
            name: submission.name,
            email: submission.email,
            phone: submission.phone,
            subject: submission.subject,
            message: submission.message,
            submittedAt: submission.created_at,
        });

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `Contact Form: ${submission.subject}`,
            html: emailHtml,
            replyTo: submission.email, // Allow admin to reply directly
        });

        if (error) {
            console.error('Error sending contact form notification:', error);
            throw error;
        }

        console.log('Contact form notification sent:', data);
        return data;
    } catch (error) {
        console.error('Failed to send contact form notification:', error);
        return null;
    }
}
