import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Mock store (in memory - resets on restart) or just constant for now
let PRICING_CONFIG = {
    baseRate: 450,
    cleaningFee: 150,
    serviceFeePercent: 12,
    taxPercent: 10
};

export async function GET() {
    // In a real app, fetch from 'property_settings' table
    return NextResponse.json(PRICING_CONFIG);
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        // Validate inputs
        if (body.baseRate) PRICING_CONFIG.baseRate = Number(body.baseRate);
        if (body.cleaningFee) PRICING_CONFIG.cleaningFee = Number(body.cleaningFee);
        if (body.serviceFeePercent) PRICING_CONFIG.serviceFeePercent = Number(body.serviceFeePercent);
        if (body.taxPercent) PRICING_CONFIG.taxPercent = Number(body.taxPercent);

        // In real app: await supabase.from('settings').update(...)

        return NextResponse.json({ success: true, data: PRICING_CONFIG });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update pricing' }, { status: 500 });
    }
}
