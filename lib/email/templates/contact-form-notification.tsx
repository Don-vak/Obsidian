interface ContactFormNotificationProps {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    submittedAt: string;
}

export function ContactFormNotification(props: ContactFormNotificationProps): string {
    const { name, email, phone, subject, message, submittedAt } = props;

    const formattedDate = new Date(submittedAt).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1C1917; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAF9; }
        .container { background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background-color: #3B82F6; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: 700; margin: 0; }
        .timestamp { font-size: 14px; margin-top: 5px; opacity: 0.9; }
        .section { margin: 20px 0; padding: 20px; background-color: #F5F5F4; border-radius: 8px; }
        .section-title { font-size: 14px; font-weight: 600; color: #78716C; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
        .info-row { padding: 8px 0; }
        .label { color: #78716C; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .value { font-weight: 600; color: #1C1917; margin-top: 5px; }
        .message-box { background-color: white; border: 2px solid #E7E5E4; border-radius: 8px; padding: 20px; margin: 20px 0; white-space: pre-wrap; line-height: 1.8; }
        .reply-button { display: inline-block; background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">📬 New Contact Form Submission</div>
            <div class="timestamp">${formattedDate}</div>
        </div>
        <div class="section">
            <div class="section-title">Contact Information</div>
            <div class="info-row"><div class="label">Name</div><div class="value">${name}</div></div>
            <div class="info-row"><div class="label">Email</div><div class="value">${email}</div></div>
            ${phone ? `<div class="info-row"><div class="label">Phone</div><div class="value">${phone}</div></div>` : ''}
            <div class="info-row"><div class="label">Subject</div><div class="value">${subject}</div></div>
        </div>
        <div class="section">
            <div class="section-title">Message</div>
            <div class="message-box">${message}</div>
        </div>
        <div style="text-align: center;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="reply-button">Reply to ${name}</a>
        </div>
    </div>
</body>
</html>
    `;
}
