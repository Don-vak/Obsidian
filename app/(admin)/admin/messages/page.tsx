import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { MessageList } from '@/components/admin/MessageList';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
    const supabase = await createServerSupabaseClient();

    // Fetch contact submissions
    const { data: messages } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="mb-8">
                <h2 className="font-serif text-2xl text-[#1C1917]">Inbox</h2>
                <p className="text-sm text-stone-400 mt-1">Contact form submissions</p>
            </div>

            <MessageList messages={messages || []} />
        </div>
    );
}
