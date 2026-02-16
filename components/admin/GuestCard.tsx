import React from 'react';
import { ShieldCheck, ShieldAlert, User, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

interface GuestPlugin {
    id: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    trip_purpose: string;
    check_in: string;
    identity_verified: boolean;
    agreed_to_rental_agreement: boolean;
}

export function GuestCard({ guest }: { guest: GuestPlugin }) {
    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 hover:shadow-md transition-shadow relative group">
            <Link href={`/admin/bookings/${guest.id}`} className="absolute inset-0" />

            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-serif text-xl border border-stone-200">
                    {guest.guest_name.charAt(0)}
                </div>
                {guest.identity_verified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-[10px] uppercase font-bold tracking-wider border border-green-100">
                        <ShieldCheck size={12} />
                        Verified
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] uppercase font-bold tracking-wider border border-amber-100">
                        <ShieldAlert size={12} />
                        Pending
                    </span>
                )}
            </div>

            <h3 className="font-serif text-lg text-[#1C1917] mb-1">{guest.guest_name}</h3>
            <p className="text-xs text-stone-400 mb-4">{guest.guest_email}</p>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Clock size={14} className="text-stone-300" />
                    <span>Arrival: {new Date(guest.check_in).toLocaleDateString()}</span>
                </div>
                {guest.trip_purpose && (
                    <div className="flex items-start gap-2 text-xs text-stone-500">
                        <MapPin size={14} className="text-stone-300 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{guest.trip_purpose}</span>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className={guest.agreed_to_rental_agreement ? "text-green-600" : "text-stone-400"}>
                    {guest.agreed_to_rental_agreement ? "Agreement Signed" : "Agreement Pending"}
                </span>
                <span className="text-[#A18058] font-medium group-hover:underline">View Booking</span>
            </div>
        </div>
    );
}
