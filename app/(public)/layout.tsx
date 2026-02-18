import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch user server-side to avoid waterfall in Navbar
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = !!user; // Simplified check - strictly speaking any logged in user effectively has admin access in this minimal app, or verify role if needed. But consistent with previous logic.

    return (
        <>
            <Navbar isAdminUser={isAdmin} />
            <PageTransition>
                <main>{children}</main>
            </PageTransition>
            <Footer />
        </>
    );
}
