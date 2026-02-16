import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Calendar, CreditCard, ShieldCheck, ShieldAlert, Clock, MessageSquare, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;
    const { data: booking, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !booking) {
        notFound();
    }

    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'text-green-700 bg-green-50 border-green-100';
            case 'pending': return 'text-amber-700 bg-amber-50 border-amber-100';
            case 'cancelled': return 'text-red-700 bg-red-50 border-red-100';
            default: return 'text-stone-600 bg-stone-50 border-stone-100';
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/bookings"
                    className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-[#A18058] transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Back to bookings
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-3xl text-[#1C1917] mb-2">
                            Booking #{booking.id.slice(0, 8)}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)} uppercase tracking-wider`}>
                                {booking.status}
                            </span>
                            <span className="text-stone-400 text-sm">
                                Created on {new Date(booking.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Actions (Phase 2 placeholder) */}
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-full border border-stone-200 text-xs uppercase tracking-wider font-medium hover:bg-stone-50 transition-colors">
                            Edit Booking
                        </button>
                        <button className="px-4 py-2 rounded-full bg-[#1C1917] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#2C2926] transition-colors">
                            Send Message
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Guest & Trip Info */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Guest Details */}
                    <section className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                        <h3 className="font-serif text-xl text-[#1C1917] mb-6 flex items-center gap-2">
                            <User size={20} className="text-[#A18058]" />
                            Guest Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Full Name</label>
                                <p className="text-[#1C1917] font-medium text-lg">{booking.guest_name}</p>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Email Address</label>
                                <a href={`mailto:${booking.guest_email}`} className="text-[#1C1917] hover:text-[#A18058] flex items-center gap-2">
                                    <Mail size={14} className="text-stone-400" />
                                    {booking.guest_email}
                                </a>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Phone Number</label>
                                <a href={`tel:${booking.guest_phone}`} className="text-[#1C1917] flex items-center gap-2">
                                    <Phone size={14} className="text-stone-400" />
                                    {booking.guest_phone}
                                </a>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Guests</label>
                                <p className="text-[#1C1917]">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                            </div>
                        </div>
                    </section>

                    {/* Stay Information */}
                    <section className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                        <h3 className="font-serif text-xl text-[#1C1917] mb-6 flex items-center gap-2">
                            <Calendar size={20} className="text-[#A18058]" />
                            Stay Information
                        </h3>

                        <div className="flex items-center gap-4 mb-8 bg-stone-50 p-4 rounded-xl border border-stone-100">
                            <div className="text-center flex-1">
                                <span className="block text-xs text-stone-400 uppercase tracking-widest mb-1">Check-in</span>
                                <span className="block text-lg font-serif text-[#1C1917]">{checkIn.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                <span className="block text-xs text-stone-500 mt-1">{booking.arrival_time || '3:00 PM'}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="h-px w-10 bg-stone-300 mb-1"></div>
                                <span className="text-[10px] uppercase tracking-widest text-stone-400">{nights} Nights</span>
                                <div className="h-px w-10 bg-stone-300 mt-1"></div>
                            </div>
                            <div className="text-center flex-1">
                                <span className="block text-xs text-stone-400 uppercase tracking-widest mb-1">Check-out</span>
                                <span className="block text-lg font-serif text-[#1C1917]">{checkOut.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                <span className="block text-xs text-stone-500 mt-1">11:00 AM</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2">Special Requests</label>
                            <div className="bg-stone-50 p-4 rounded-xl text-sm text-stone-600 italic border border-stone-100 min-h-[60px]">
                                {booking.special_requests || "No special requests."}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Verification & Payment */}
                <div className="space-y-8">

                    {/* Verification Status */}
                    <section className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                        <h3 className="font-serif text-xl text-[#1C1917] mb-6 flex items-center gap-2">
                            <ShieldCheck size={20} className="text-[#A18058]" />
                            Guest Verification
                        </h3>

                        <div className="space-y-4">
                            {/* Identity */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                                <div className="flex items-center gap-3">
                                    {booking.identity_verified ? (
                                        <ShieldCheck className="text-green-600" size={18} />
                                    ) : (
                                        <ShieldAlert className="text-stone-400" size={18} />
                                    )}
                                    <span className="text-sm font-medium text-[#1C1917]">Identity Verified</span>
                                </div>
                                <span className={`text-xs ${booking.identity_verified ? 'text-green-600' : 'text-stone-400'}`}>
                                    {booking.identity_verified ? 'Yes' : 'Pending'}
                                </span>
                            </div>

                            {/* Rental Agreement */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                                <div className="flex items-center gap-3">
                                    <MessageSquare size={18} className={booking.agreed_to_rental_agreement ? "text-green-600" : "text-stone-400"} />
                                    <span className="text-sm font-medium text-[#1C1917]">Rental Agreement</span>
                                </div>
                                <span className={`text-xs ${booking.agreed_to_rental_agreement ? 'text-green-600' : 'text-stone-400'}`}>
                                    {booking.agreed_to_rental_agreement ? 'Signed' : 'Pending'}
                                </span>
                            </div>

                            {/* Trip Purpose */}
                            <div className="mt-4 pt-4 border-t border-stone-100">
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Trip Purpose</label>
                                <p className="text-sm text-[#1C1917]">{booking.trip_purpose || 'Not specified'}</p>
                            </div>
                        </div>
                    </section>

                    {/* Payment Summary */}
                    <section className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                        <h3 className="font-serif text-xl text-[#1C1917] mb-6 flex items-center gap-2">
                            <CreditCard size={20} className="text-[#A18058]" />
                            Payment
                        </h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm text-stone-600">
                                <span>Total Amount</span>
                                <span className="font-medium text-[#1C1917]">${Number(booking.total_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-stone-600">
                                <span>Status</span>
                                <span className="capitalize">{booking.stripe_payment_status}</span>
                            </div>
                            <div className="flex justify-between text-sm text-stone-600">
                                <span>Paid At</span>
                                <span>{booking.paid_at ? new Date(booking.paid_at).toLocaleDateString() : '-'}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-stone-100">
                            <p className="text-xs text-stone-400 mb-2">Payment ID</p>
                            <p className="text-xs font-mono text-stone-500 break-all">{booking.stripe_payment_intent_id}</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
