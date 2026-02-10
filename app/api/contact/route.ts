import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { retrySupabaseQuery } from '@/lib/supabase/retry'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const supabase = await createServerSupabaseClient()

        // Validate required fields
        if (!body.name || !body.email || !body.subject || !body.message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Create contact submission with retry
        const { data, error } = await retrySupabaseQuery(
            () => supabase
                .from('contact_submissions')
                .insert({
                    name: body.name,
                    email: body.email,
                    phone: body.phone || null,
                    subject: body.subject,
                    message: body.message,
                    status: 'new'
                })
                .select()
                .single(),
            'create-contact-submission'
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
            await sendContactFormNotification(data)
        } catch (emailError) {
            console.error('Error sending contact form notification:', emailError)
            // Don't throw - submission succeeded, email is secondary
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
