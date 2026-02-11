import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { resilientQuery, CACHE_TTL } from '@/lib/supabase/resilient'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const nights = parseInt(searchParams.get('nights') || '0')

        if (nights < 1) {
            return NextResponse.json({ error: 'Invalid nights parameter' }, { status: 400 })
        }

        const supabase = await createServerSupabaseClient()

        // Pricing config changes rarely — use longer cache
        const { data: config, error } = await resilientQuery(
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

        if (error || !config) {
            console.error('Error fetching pricing config:', error)
            return NextResponse.json(
                { error: error?.message || 'Service temporarily unavailable.', retryable: true },
                { status: 503 }
            )
        }

        // Calculate pricing
        const cfg = config as Record<string, number>
        const subtotal = Number(cfg.base_nightly_rate) * nights

        let discount = 0
        if (nights >= 28) {
            discount = subtotal * (Number(cfg.monthly_discount_percentage) / 100)
        } else if (nights >= 7) {
            discount = subtotal * (Number(cfg.weekly_discount_percentage) / 100)
        }

        const discountedSubtotal = subtotal - discount
        const serviceFee = discountedSubtotal * (Number(cfg.service_fee_percentage) / 100)
        const taxAmount = (discountedSubtotal + serviceFee + Number(cfg.cleaning_fee)) * (Number(cfg.tax_percentage) / 100)
        const total = discountedSubtotal + Number(cfg.cleaning_fee) + serviceFee + taxAmount

        return NextResponse.json({
            nights,
            nightlyRate: Number(cfg.base_nightly_rate),
            subtotal: Number(subtotal.toFixed(2)),
            discount: Number(discount.toFixed(2)),
            cleaningFee: Number(cfg.cleaning_fee),
            serviceFee: Number(serviceFee.toFixed(2)),
            taxAmount: Number(taxAmount.toFixed(2)),
            total: Number(total.toFixed(2))
        })
    } catch (error) {
        console.error('Error calculating pricing:', error)
        return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.', retryable: true },
            { status: 503 }
        )
    }
}
