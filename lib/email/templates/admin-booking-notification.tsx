interface AdminBookingNotificationProps {
    bookingNumber: string;
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    guestCount: number;
    total: number;
}

export function AdminBookingNotification(props: AdminBookingNotificationProps): string {
    const { bookingNumber, guestName, guestEmail, guestPhone, checkIn, checkOut, nights, guestCount, total } = props;

    const checkInDate = new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const checkOutDate = new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1C1917; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAF9; }
        .container { background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background-color: #10B981; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: 700; margin: 0; }
        .booking-number { font-size: 18px; margin-top: 5px; opacity: 0.9; }
        .section { margin: 20px 0; padding: 20px; background-color: #F5F5F4; border-radius: 8px; }
        .section-title { font-size: 14px; font-weight: 600; color: #78716C; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .label { color: #78716C; }
        .value { font-weight: 600; color: #1C1917; }
        .amount { font-size: 28px; font-weight: 700; color: #10B981; text-align: center; margin: 20px 0; }
        .highlight { background-color: #FEF3C7; padding: 15px; border-radius: 8px; border-left: 4px solid #F59E0B; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">🎉 New Booking Received!</div>
            <div class="booking-number">${bookingNumber}</div>
        </div>
        <div class="amount">$${total.toFixed(2)}</div>
        <div class="section">
            <div class="section-title">Guest Information</div>
            <div class="info-row"><span class="label">Name:</span><span class="value">${guestName}</span></div>
            <div class="info-row"><span class="label">Email:</span><span class="value">${guestEmail}</span></div>
            ${guestPhone ? `<div class="info-row"><span class="label">Phone:</span><span class="value">${guestPhone}</span></div>` : ''}
        </div>
        <div class="section">
            <div class="section-title">Booking Details</div>
            <div class="info-row"><span class="label">Check-in:</span><span class="value">${checkInDate}</span></div>
            <div class="info-row"><span class="label">Check-out:</span><span class="value">${checkOutDate}</span></div>
            <div class="info-row"><span class="label">Nights:</span><span class="value">${nights}</span></div>
            <div class="info-row"><span class="label">Guests:</span><span class="value">${guestCount}</span></div>
        </div>
        <div class="highlight"><strong>✅ Payment Confirmed</strong><br>The booking has been paid in full via Stripe.</div>
    </div>
</body>
</html>
    `;
}
