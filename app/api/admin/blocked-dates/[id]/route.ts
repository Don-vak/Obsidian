import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createServerSupabaseClient();
        const { id } = await params;

        // Verify it is a blocked date (sanity check)
        const { data: booking, error: fetchError } = await supabase
            .from('bookings')
            .select('status')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        if (booking.status !== 'blocked') {
            return NextResponse.json({ error: 'Cannot delete a real booking via this endpoint' }, { status: 403 });
        }

        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error unblocking dates:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
