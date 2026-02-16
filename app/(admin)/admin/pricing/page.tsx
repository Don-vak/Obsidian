import React from 'react';
import { PricingForm } from '@/components/admin/PricingForm';

export default function PricingPage() {
    return (
        <div>
            <div className="mb-8">
                <h2 className="font-serif text-2xl text-[#1C1917]">Pricing Settings</h2>
                <p className="text-sm text-stone-400 mt-1">Manage base rates, fees, and taxes</p>
            </div>

            <PricingForm />
        </div>
    );
}
