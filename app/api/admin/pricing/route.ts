import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();

        // Fetch the current active pricing config
        const { data, error } = await supabase
            .from('pricing_config')
            .select('*')
            .lte('effective_from', new Date().toISOString().split('T')[0])
            .or(`effective_to.is.null,effective_to.gte.${new Date().toISOString().split('T')[0]}`)
            .order('effective_from', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error('Error fetching pricing config:', error);
            // Return defaults if no config found
            return NextResponse.json({
                id: null,
                baseRate: 450,
                cleaningFee: 150,
                serviceFeePercent: 12,
                taxPercent: 10,
                minimumNights: 2,
                weeklyDiscount: 10,
                monthlyDiscount: 20
            });
        }

        // Map database columns to frontend-friendly names
        return NextResponse.json({
            id: data.id,
            baseRate: Number(data.base_nightly_rate),
            cleaningFee: Number(data.cleaning_fee),
            serviceFeePercent: Number(data.service_fee_percentage),
            taxPercent: Number(data.tax_percentage),
            minimumNights: data.minimum_nights,
            weeklyDiscount: Number(data.weekly_discount_percentage),
            monthlyDiscount: Number(data.monthly_discount_percentage),
            effectiveFrom: data.effective_from,
            effectiveTo: data.effective_to
        });
    } catch (error: any) {
        console.error('Error in pricing GET:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = await request.json();

        // Get the current config ID
        const { data: current } = await supabase
            .from('pricing_config')
            .select('id')
            .lte('effective_from', new Date().toISOString().split('T')[0])
            .or(`effective_to.is.null,effective_to.gte.${new Date().toISOString().split('T')[0]}`)
            .order('effective_from', { ascending: false })
            .limit(1)
            .single();

        const updateData: Record<string, any> = {};
        if (body.baseRate !== undefined) updateData.base_nightly_rate = body.baseRate;
        if (body.cleaningFee !== undefined) updateData.cleaning_fee = body.cleaningFee;
        if (body.serviceFeePercent !== undefined) updateData.service_fee_percentage = body.serviceFeePercent;
        if (body.taxPercent !== undefined) updateData.tax_percentage = body.taxPercent;
        if (body.minimumNights !== undefined) updateData.minimum_nights = body.minimumNights;
        if (body.weeklyDiscount !== undefined) updateData.weekly_discount_percentage = body.weeklyDiscount;
        if (body.monthlyDiscount !== undefined) updateData.monthly_discount_percentage = body.monthlyDiscount;

        let result;

        if (current?.id) {
            // Update existing config
            const { data, error } = await supabase
                .from('pricing_config')
                .update(updateData)
                .eq('id', current.id)
                .select()
                .single();

            if (error) throw error;
            result = data;
        } else {
            // No existing config — insert a new one
            const { data, error } = await supabase
                .from('pricing_config')
                .insert({
                    base_nightly_rate: body.baseRate || 450,
                    cleaning_fee: body.cleaningFee || 150,
                    service_fee_percentage: body.serviceFeePercent || 12,
                    tax_percentage: body.taxPercent || 10,
                    minimum_nights: body.minimumNights || 2,
                    weekly_discount_percentage: body.weeklyDiscount || 10,
                    monthly_discount_percentage: body.monthlyDiscount || 20,
                    effective_from: new Date().toISOString().split('T')[0]
                })
                .select()
                .single();

            if (error) throw error;
            result = data;
        }

        return NextResponse.json({
            success: true,
            data: {
                id: result.id,
                baseRate: Number(result.base_nightly_rate),
                cleaningFee: Number(result.cleaning_fee),
                serviceFeePercent: Number(result.service_fee_percentage),
                taxPercent: Number(result.tax_percentage),
                minimumNights: result.minimum_nights,
                weeklyDiscount: Number(result.weekly_discount_percentage),
                monthlyDiscount: Number(result.monthly_discount_percentage)
            }
        });
    } catch (error: any) {
        console.error('Error updating pricing config:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
