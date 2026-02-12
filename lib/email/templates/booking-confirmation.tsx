interface BookingConfirmationEmailProps {
    bookingNumber: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    guestCount: number;
    nightlyRate: number;
    subtotal: number;
    discount: number;
    cleaningFee: number;
    serviceFee: number;
    taxAmount: number;
    total: number;
}

export function BookingConfirmationEmail(props: BookingConfirmationEmailProps): string {
    const {
        bookingNumber,
        guestName,
        checkIn,
        checkOut,
        nights,
        guestCount,
        nightlyRate,
        subtotal,
        discount,
        cleaningFee,
        serviceFee,
        taxAmount,
        total,
    } = props;

    const checkInDate = new Date(checkIn).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const checkOutDate = new Date(checkOut).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1C1917;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #FAFAF9;
        }
        .container {
            background-color: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #A18058;
        }
        .logo {
            font-size: 28px;
            font-weight: 300;
            color: #1C1917;
            letter-spacing: 2px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1C1917;
            margin: 30px 0 10px;
        }
        .subtitle {
            font-size: 16px;
            color: #78716C;
            margin-bottom: 30px;
        }
        .booking-number {
            background-color: #F5F5F4;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-size: 18px;
            font-weight: 600;
            color: #A18058;
            margin-bottom: 30px;
        }
        .section {
            margin: 30px 0;
        }
        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #1C1917;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #E7E5E4;
        }
        .detail-label {
            color: #78716C;
        }
        .detail-value {
            font-weight: 600;
            color: #1C1917;
        }
        .pricing-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
        }
        .pricing-total {
            border-top: 2px solid #1C1917;
            margin-top: 10px;
            padding-top: 15px;
            font-size: 18px;
            font-weight: 700;
        }
        .info-box {
            background-color: #F0F9FF;
            border-left: 4px solid #3B82F6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E7E5E4;
            color: #78716C;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">THE OBSIDIAN</div>
        </div>

        <div class="title">Booking Confirmed! 🎉</div>
        <div class="subtitle">Hi ${guestName}, your reservation has been confirmed.</div>

        <div class="booking-number">
            Booking #${bookingNumber}
        </div>

        <div class="section">
            <div class="section-title">Booking Details</div>
            <div class="detail-row">
                <span class="detail-label">Check-in</span>
                <span class="detail-value">${checkInDate} (3:00 PM)</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Check-out</span>
                <span class="detail-value">${checkOutDate} (11:00 AM)</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Nights</span>
                <span class="detail-value">${nights}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Guests</span>
                <span class="detail-value">${guestCount}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Pricing Summary</div>
            <div class="pricing-row">
                <span>${nights} nights × $${nightlyRate.toFixed(2)}</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            ${discount > 0 ? `
            <div class="pricing-row">
                <span>Discount</span>
                <span>-$${discount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="pricing-row">
                <span>Cleaning Fee</span>
                <span>$${cleaningFee.toFixed(2)}</span>
            </div>
            <div class="pricing-row">
                <span>Service Fee</span>
                <span>$${serviceFee.toFixed(2)}</span>
            </div>
            <div class="pricing-row">
                <span>Tax</span>
                <span>$${taxAmount.toFixed(2)}</span>
            </div>
            <div class="pricing-row pricing-total">
                <span>Total Paid</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        </div>

        <div class="info-box">
            <strong>📍 Check-in Instructions:</strong><br>
            Check-in time is 3:00 PM. Please contact us if you need early check-in.<br>
            Check-out time is 11:00 AM.
        </div>

        <div class="section">
            <div class="section-title">🏠 House Rules</div>
            <p style="color: #78716C; font-size: 14px; margin-bottom: 20px;">
                Please review the following rules to ensure a wonderful stay for you and our community.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                    <td style="padding: 16px; background-color: #FAFAF9; border-radius: 8px 8px 0 0; border-bottom: 1px solid #E7E5E4;">
                        <strong style="color: #A18058;">🕓 Check-in &amp; Check-out</strong>
                        <p style="margin: 8px 0 0; color: #57534E; font-size: 14px; line-height: 1.5;">
                            Check-in is from 4:00 PM. Check-out is by 11:00 AM.<br>
                            Early check-in or late check-out may be available upon request.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 16px; background-color: #FAFAF9; border-bottom: 1px solid #E7E5E4;">
                        <strong style="color: #A18058;">🔇 Quiet Hours</strong>
                        <p style="margin: 8px 0 0; color: #57534E; font-size: 14px; line-height: 1.5;">
                            To respect our neighbors and the serenity of the canyon, quiet hours are strictly enforced between <strong>10:00 PM and 8:00 AM</strong>.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 16px; background-color: #FAFAF9; border-bottom: 1px solid #E7E5E4;">
                        <strong style="color: #A18058;">🚭 No Smoking</strong>
                        <p style="margin: 8px 0 0; color: #57534E; font-size: 14px; line-height: 1.5;">
                            The Obsidian is a non-smoking property. This includes outdoor decks and pool areas due to high fire risk in the hills.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 16px; background-color: #FAFAF9; border-bottom: 1px solid #E7E5E4;">
                        <strong style="color: #A18058;">👥 Occupancy</strong>
                        <p style="margin: 8px 0 0; color: #57534E; font-size: 14px; line-height: 1.5;">
                            Maximum occupancy is <strong>${guestCount} guests</strong> (as per your reservation). No unregistered guests or parties are permitted without prior written approval.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 16px; background-color: #FAFAF9; border-bottom: 1px solid #E7E5E4;">
                        <strong style="color: #A18058;">🐾 Pets</strong>
                        <p style="margin: 8px 0 0; color: #57534E; font-size: 14px; line-height: 1.5;">
                            Pets are not permitted at the property. Service animals are welcome with advance notice.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 16px; background-color: #FAFAF9; border-radius: 0 0 8px 8px;">
                        <strong style="color: #A18058;">🏊 Pool &amp; Amenities</strong>
                        <p style="margin: 8px 0 0; color: #57534E; font-size: 14px; line-height: 1.5;">
                            Please use the infinity pool, hot tub, and outdoor areas at your own risk. No glass containers near the pool. Towels are provided.
                        </p>
                    </td>
                </tr>
            </table>

            <div style="background-color: #1C1917; border-radius: 8px; padding: 16px; margin-top: 16px; text-align: center;">
                <p style="color: #A8A29E; font-size: 13px; margin: 0; line-height: 1.5;">
                    By confirming this reservation, you agree to abide by these rules. Failure to comply may result in immediate cancellation without refund.
                </p>
            </div>
        </div>

        <div class="footer">
            <p>Questions? Reply to this email or contact us at toyursi@gmail.com</p>
            <p style="margin-top: 20px; color: #A8A29E;">
                The Obsidian | Private Luxury Residence
            </p>
        </div>
    </div>
</body>
</html>
    `;
}
