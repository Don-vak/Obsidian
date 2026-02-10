import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { retrySupabaseQuery } from '@/lib/supabase/retry'

export async function GET() {
    try {
        const supabase = await createServerSupabaseClient()

        const { data, error } = await retrySupabaseQuery(
            () => supabase
                .from('pricing_config')
                .select('*')
                .lte('effective_from', new Date().toISOString().split('T')[0])
                .or(`effective_to.is.null,effective_to.gte.${new Date().toISOString().split('T')[0]}`)
                .order('effective_from', { ascending: false })
                .limit(1)
                .single(),
            'fetch-pricing-config'
        )

        if (error) {
            console.error('Error fetching pricing config:', error)
            return NextResponse.json(
                { error: 'Service temporarily unavailable. Please try again.', retryable: true },
                { status: 503 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching pricing config:', error)
        return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.', retryable: true },
            { status: 503 }
        )
    }
}
