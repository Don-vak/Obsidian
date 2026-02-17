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
        const { replyMessage } = body;

        if (!replyMessage || !replyMessage.trim()) {
            return NextResponse.json({ error: 'Reply message is required' }, { status: 400 });
        }

        // Get original message details
        const { data: originalMessage, error: fetchError } = await supabase
            .from('contact_submissions')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !originalMessage) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        // Build reply email HTML
        const emailHtml = buildReplyEmailHtml({
            guestName: originalMessage.name,
            originalSubject: originalMessage.subject,
            originalMessage: originalMessage.message,
            originalDate: originalMessage.created_at,
            replyMessage: replyMessage.trim(),
        });

        // Send via Resend
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: FROM_EMAIL,
            to: originalMessage.email,
            subject: `Re: ${originalMessage.subject}`,
            html: emailHtml,
        });

        if (emailError) {
            console.error('Error sending reply email:', emailError);
            return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
        }

        // Update message status to 'replied' and store the reply
        const { error: updateError } = await supabase
            .from('contact_submissions')
            .update({
                status: 'responded',
                admin_reply: replyMessage.trim(),
                replied_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (updateError) {
            console.error('Error updating message status:', updateError);
            // Email was sent, so return partial success
        }

        console.log('Reply email sent:', emailData);
        return NextResponse.json({ success: true, emailId: emailData?.id });

    } catch (error: any) {
        console.error('Error sending reply:', error);
        return NextResponse.json({ error: error.message || 'Failed to send reply' }, { status: 500 });
    }
}

function buildReplyEmailHtml(params: {
    guestName: string;
    originalSubject: string;
    originalMessage: string;
    originalDate: string;
    replyMessage: string;
}) {
    const formattedDate = new Date(params.originalDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

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

                        <!-- Reply Message -->
                        <tr>
                            <td style="padding:0 40px 32px;">
                                <p style="margin:0;font-size:15px;color:#44403c;line-height:1.7;white-space:pre-wrap;">${params.replyMessage}</p>
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

                        <!-- Divider -->
                        <tr>
                            <td style="padding:0 40px;">
                                <hr style="border:none;border-top:1px solid #e7e5e4;margin:0;">
                            </td>
                        </tr>

                        <!-- Original Message -->
                        <tr>
                            <td style="padding:24px 40px 8px;">
                                <p style="margin:0;font-size:11px;color:#a8a29e;text-transform:uppercase;letter-spacing:1px;">Your Original Message</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:8px 40px 12px;">
                                <p style="margin:0;font-size:12px;color:#a8a29e;">
                                    Subject: ${params.originalSubject}<br>
                                    Date: ${formattedDate}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0 40px 32px;">
                                <div style="background-color:#fafaf9;border-left:3px solid #d6d3d1;padding:16px;border-radius:0 8px 8px 0;">
                                    <p style="margin:0;font-size:13px;color:#78716c;line-height:1.6;white-space:pre-wrap;">${params.originalMessage}</p>
                                </div>
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
