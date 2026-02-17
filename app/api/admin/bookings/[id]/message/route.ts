import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { resend } from '@/lib/email/client';

const FROM_EMAIL = 'The Obsidian <onboarding@resend.dev>'; // Use your verified domain in production

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createServerSupabaseClient();
        const { id } = await params;
        const body = await request.json();
        const { subject, message, type } = body; // type: 'general' | 'special_request_reply'

        if (!message || !message.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Fetch booking to get guest email
        const { data: booking, error: fetchError } = await supabase
            .from('bookings')
            .select('guest_name, guest_email, special_requests, booking_number, check_in, check_out')
            .eq('id', id)
            .single();

        if (fetchError || !booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const emailSubject = subject?.trim()
            || (type === 'special_request_reply'
                ? `Regarding Your Special Request - Booking #${booking.booking_number || id.slice(0, 8)}`
                : `Message from The Obsidian - Booking #${booking.booking_number || id.slice(0, 8)}`);

        // Build email HTML
        const emailHtml = buildBookingMessageHtml({
            guestName: booking.guest_name,
            bookingNumber: booking.booking_number || id.slice(0, 8),
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            subject: emailSubject,
            message: message.trim(),
            type: type || 'general',
            specialRequest: booking.special_requests,
        });

        // Send via Resend
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: FROM_EMAIL,
            to: booking.guest_email,
            subject: emailSubject,
            html: emailHtml,
        });

        if (emailError) {
            console.error('Error sending booking message:', emailError);
            return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
        }

        console.log('Booking message sent:', emailData);
        return NextResponse.json({ success: true, emailId: emailData?.id });

    } catch (error: any) {
        console.error('Error sending booking message:', error);
        return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
    }
}

function buildBookingMessageHtml(params: {
    guestName: string;
    bookingNumber: string;
    checkIn: string;
    checkOut: string;
    subject: string;
    message: string;
    type: string;
    specialRequest?: string;
}) {
    const checkIn = new Date(params.checkIn).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const checkOut = new Date(params.checkOut).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

    const specialRequestBlock = params.type === 'special_request_reply' && params.specialRequest
        ? `
        <tr>
            <td style="padding:0 40px 24px;">
                <p style="margin:0 0 8px;font-size:11px;color:#a8a29e;text-transform:uppercase;letter-spacing:1px;">Your Special Request</p>
                <div style="background-color:#fafaf9;border-left:3px solid #A18058;padding:16px;border-radius:0 8px 8px 0;">
                    <p style="margin:0;font-size:13px;color:#78716c;line-height:1.6;font-style:italic;">${params.specialRequest}</p>
                </div>
            </td>
        </tr>
        `
        : '';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafaf9;padding:40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
                        <!-- Header -->
                        <tr>
                            <td style="background-color:#1C1917;padding:32px 40px;text-align:center;">
                                <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#ffffff;letter-spacing:2px;">THE OBSIDIAN</h1>
                            </td>
                        </tr>

                        <!-- Greeting -->
                        <tr>
                            <td style="padding:40px 40px 16px;">
                                <p style="margin:0;font-size:16px;color:#1C1917;">Hello ${params.guestName},</p>
                            </td>
                        </tr>

                        <!-- Message Body -->
                        <tr>
                            <td style="padding:0 40px 24px;">
                                <p style="margin:0;font-size:15px;color:#44403c;line-height:1.7;white-space:pre-wrap;">${params.message}</p>
                            </td>
                        </tr>

                        <!-- Special Request Quote (if replying to one) -->
                        ${specialRequestBlock}

                        <!-- Booking Reference -->
                        <tr>
                            <td style="padding:0 40px 32px;">
                                <div style="background-color:#fafaf9;border-radius:12px;padding:20px;border:1px solid #e7e5e4;">
                                    <p style="margin:0 0 8px;font-size:11px;color:#a8a29e;text-transform:uppercase;letter-spacing:1px;">Your Booking</p>
                                    <p style="margin:0;font-size:14px;color:#1C1917;font-weight:600;">Booking #${params.bookingNumber}</p>
                                    <p style="margin:4px 0 0;font-size:13px;color:#78716c;">${checkIn} → ${checkOut}</p>
                                </div>
                            </td>
                        </tr>

                        <!-- Signature -->
                        <tr>
                            <td style="padding:0 40px 32px;">
                                <p style="margin:0;font-size:14px;color:#78716c;">
                                    Warm regards,<br>
                                    <strong style="color:#1C1917;">The Obsidian Team</strong>
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#fafaf9;padding:24px 40px;text-align:center;border-top:1px solid #e7e5e4;">
                                <p style="margin:0;font-size:11px;color:#a8a29e;">
                                    &copy; ${new Date().getFullYear()} The Obsidian. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}
