import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { resilientQuery } from '@/lib/supabase/resilient'

import { ContactSubmissionSchema } from '@/lib/schemas/api'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const result = ContactSubmissionSchema.safeParse(body)
        const supabase = await createServerSupabaseClient()

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid request data', details: result.error.flatten() },
                { status: 400 }
            )
        }

        const { name, email, phone, subject, message } = result.data

        // Create contact submission with resilience (no caching for writes)
        const { data, error } = await resilientQuery(
            `contact:${Date.now()}`,
            () => supabase
                .from('contact_submissions')
                .insert({
                    name,
                    email,
                    phone: phone || null,
                    subject,
                    message,
                    status: 'new'
                })
                .select()
                .single(),
            'create-contact-submission',
            { cacheTTL: 0 } // No caching for writes
        )

        if (error) {
            console.error('Error creating contact submission:', error)
            return NextResponse.json(
                { error: 'Service temporarily unavailable. Please try again.', retryable: true },
                { status: 503 }
            )
        }

        // Send notification email to admin (non-blocking)
        try {
            const { sendContactFormNotification } = await import('@/lib/email/send')
            await sendContactFormNotification(data as any)
        } catch (emailError) {
            console.error('Error sending contact form notification:', emailError)
        }

        return NextResponse.json({
            success: true,
            message: 'Thank you for your message. We will get back to you soon!'
        })
    } catch (error) {
        console.error('Error submitting contact form:', error)
        return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.', retryable: true },
            { status: 503 }
        )
    }
}
