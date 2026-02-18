import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
    style: ['normal', 'italic'],
    weight: ['400', '500'],
});

export const metadata: Metadata = {
    title: "Chic Music Row Condo | Nashville",
    description: "Luxury Music Row condo with rooftop pool, gym, free parking. Steps from Vanderbilt and Broadway.",
    openGraph: {
        title: "The Obsidian | Private Residence",
        description: "Sanctuary in the hills. A masterfully designed architectural gem.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.variable} ${playfair.variable} antialiased selection:bg-[#A18058] selection:text-white font-sans`} suppressHydrationWarning>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
