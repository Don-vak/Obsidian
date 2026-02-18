import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';

import { CreateVerificationSessionSchema } from '@/lib/schemas/api';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = CreateVerificationSessionSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid request data', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { guestName, guestEmail, bookingMetadata } = result.data;

        // Create a Stripe Identity VerificationSession
        const verificationSession = await stripe.identity.verificationSessions.create({
            type: 'document',
            metadata: {
                guestName,
                guestEmail,
                ...bookingMetadata,
            },
            options: {
                document: {
                    require_matching_selfie: true,
                    allowed_types: ['driving_license', 'passport', 'id_card'],
                },
            },
        });

        return NextResponse.json({
            clientSecret: verificationSession.client_secret,
            sessionId: verificationSession.id,
            status: verificationSession.status,
        });
    } catch (error: any) {
        console.error('Error creating verification session:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create verification session' },
            { status: 500 }
        );
    }
}
