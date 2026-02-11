import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { resilientQuery, CACHE_TTL } from '@/lib/supabase/resilient'

export async function GET() {
    try {
        const supabase = await createServerSupabaseClient()

        // Pricing config changes rarely — use longer cache
        const { data, error, fromCache } = await resilientQuery(
            'pricing-config',
            () => supabase
                .from('pricing_config')
                .select('*')
                .lte('effective_from', new Date().toISOString().split('T')[0])
                .or(`effective_to.is.null,effective_to.gte.${new Date().toISOString().split('T')[0]}`)
                .order('effective_from', { ascending: false })
                .limit(1)
                .single(),
            'fetch-pricing-config',
            { cacheTTL: CACHE_TTL.LONG }
        )

        if (error) {
            console.error('Error fetching pricing config:', error)
            return NextResponse.json(
                { error: error.message || 'Service temporarily unavailable.', retryable: true },
                { status: 503 }
            )
        }

        return NextResponse.json(data, {
            headers: fromCache ? { 'X-Cache': 'HIT' } : { 'X-Cache': 'MISS' },
        })
    } catch (error) {
        console.error('Error fetching pricing config:', error)
        return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.', retryable: true },
            { status: 503 }
        )
    }
}
