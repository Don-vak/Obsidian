import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createServerSupabaseClient();
        const { id } = await params;
        const body = await request.json(); // { status: 'read' | 'replied' }

        const { error } = await supabase
            .from('contact_submissions')
            .update({ status: body.status })
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error updating message:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
