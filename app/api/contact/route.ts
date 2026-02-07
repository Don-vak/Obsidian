import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const supabase = await createServerSupabaseClient()

        // Validate required fields
        if (!body.name || !body.email || !body.subject || !body.message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Create contact submission
        const { data, error } = await supabase
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
            .single()

        if (error) {
            console.error('Error creating contact submission:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // TODO: Send notification email to admin

        return NextResponse.json({
            success: true,
            message: 'Thank you for your message. We will get back to you soon!'
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
