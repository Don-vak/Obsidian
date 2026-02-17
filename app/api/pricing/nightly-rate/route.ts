import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createServerSupabaseClient()

        const { data: config } = await supabase
            .from('pricing_config')
            .select('base_nightly_rate')
            .lte('effective_from', new Date().toISOString().split('T')[0])
            .or(`effective_to.is.null,effective_to.gte.${new Date().toISOString().split('T')[0]}`)
            .order('effective_from', { ascending: false })
            .limit(1)
            .single()

        return NextResponse.json({
            nightlyRate: config ? Number(config.base_nightly_rate) : 450,
        })
    } catch {
        return NextResponse.json({ nightlyRate: 450 })
    }
}
