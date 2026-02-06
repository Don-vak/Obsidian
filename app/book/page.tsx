'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Users, Mail, Phone, User, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { PricingSummary } from '@/components/PricingSummary';
import { bookingFormSchema, type BookingFormData } from '@/lib/schemas/booking';
import { calculateBookingPrice, type PricingBreakdown } from '@/lib/mock-data/pricing';
import { checkAvailability } from '@/lib/mock-data/availability';
import Link from 'next/link';

const steps = ['Dates & Guests', 'Guest Information', 'Review & Confirm'];

export default function BookingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
    const [availabilityError, setAvailabilityError] = useState<string>('');

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            guestCount: 2,
            agreeToHouseRules: false,
            agreeToCancellationPolicy: false,
        },
    });

    const checkIn = watch('checkIn');
    const checkOut = watch('checkOut');
    const guestCount = watch('guestCount');

    // Calculate pricing when dates change
    useEffect(() => {
        if (checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

            if (nights > 0) {
                // Check availability
                const availability = checkAvailability(checkIn, checkOut);
                if (!availability.available) {
                    setAvailabilityError(availability.message);
                    setPricing(null);
                } else {
                    setAvailabilityError('');
                    const calculatedPricing = calculateBookingPrice(nights);
                    setPricing(calculatedPricing);
                }
            }
        }
    }, [checkIn, checkOut]);

    const onSubmit = (data: BookingFormData) => {
        // Mock booking submission
        console.log('Booking submitted:', data);

        // Store booking data in sessionStorage for success page
        sessionStorage.setItem('bookingData', JSON.stringify({
            ...data,
            pricing,
            bookingId: Math.random().toString(36).substr(2, 9),
        }));

        // Redirect to success page
        router.push('/booking-success');
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const canProceedStep1 = checkIn && checkOut && guestCount && !availabilityError && pricing;

    return (
        <div className="min-h-screen bg-[#FAFAF9]">
            {/* Header */}
            <nav className="bg-white border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <Link href="/" className="text-xl serif font-light text-stone-900">
                        The Obsidian
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <ProgressIndicator steps={steps} currentStep={currentStep} />

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Side - Form */}
                    <div className="lg:w-3/5">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Step 1: Dates & Guests */}
                            {currentStep === 0 && (
                                <div>
                                    <h1 className="text-4xl md:text-5xl serif font-light text-stone-900 mb-3">
                                        Book Your Stay
                                    </h1>
                                    <p className="text-lg text-stone-600 font-light mb-8">
                                        Select your dates and number of guests
                                    </p>

                                    <div className="space-y-4">
                                        {/* Check-in Date */}
                                        <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                                            <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                Check In
                                            </label>
                                            <input
                                                type="date"
                                                {...register('checkIn')}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full bg-transparent border-none outline-none text-sm font-medium p-0 z-10 relative text-stone-900"
                                            />
                                            <div className="absolute right-4 bottom-3 pointer-events-none text-stone-400">
                                                <Calendar size={16} />
                                            </div>
                                        </div>
                                        {errors.checkIn && (
                                            <p className="text-xs text-red-500 mt-1">{errors.checkIn.message}</p>
                                        )}

                                        {/* Check-out Date */}
                                        <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                                            <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                Check Out
                                            </label>
                                            <input
                                                type="date"
                                                {...register('checkOut')}
                                                min={checkIn || new Date().toISOString().split('T')[0]}
                                                className="w-full bg-transparent border-none outline-none text-sm font-medium p-0 z-10 relative text-stone-900"
                                            />
                                            <div className="absolute right-4 bottom-3 pointer-events-none text-stone-400">
                                                <Calendar size={16} />
                                            </div>
                                        </div>
                                        {errors.checkOut && (
                                            <p className="text-xs text-red-500 mt-1">{errors.checkOut.message}</p>
                                        )}

                                        {availabilityError && (
                                            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                                                <p className="text-sm text-red-600">{availabilityError}</p>
                                            </div>
                                        )}

                                        {/* Guest Count */}
                                        <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50">
                                            <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                Guests
                                            </label>
                                            <div className="flex justify-between items-center">
                                                <select
                                                    {...register('guestCount', { valueAsNumber: true })}
                                                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900 cursor-pointer"
                                                >
                                                    <option value={1}>1 Guest</option>
                                                    <option value={2}>2 Guests</option>
                                                    <option value={3}>3 Guests</option>
                                                    <option value={4}>4 Guests</option>
                                                </select>
                                                <Users size={16} className="text-stone-400" />
                                            </div>
                                        </div>
                                        {errors.guestCount && (
                                            <p className="text-xs text-red-500 mt-1">{errors.guestCount.message}</p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            disabled={!canProceedStep1}
                                            className="w-full bg-[#1C1917] hover:bg-[#292524] disabled:bg-stone-300 disabled:cursor-not-allowed text-[#FAFAF9] py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 mt-8 group"
                                        >
                                            Continue
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Guest Information */}
                            {currentStep === 1 && (
                                <div>
                                    <h1 className="text-4xl md:text-5xl serif font-light text-stone-900 mb-3">
                                        Guest Information
                                    </h1>
                                    <p className="text-lg text-stone-600 font-light mb-8">
                                        Tell us about yourself
                                    </p>

                                    <div className="space-y-4">
                                        {/* Full Name */}
                                        <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                                            <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                Full Name
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-stone-400" />
                                                <input
                                                    type="text"
                                                    {...register('guestName')}
                                                    placeholder="John Doe"
                                                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900"
                                                />
                                            </div>
                                        </div>
                                        {errors.guestName && (
                                            <p className="text-xs text-red-500 mt-1">{errors.guestName.message}</p>
                                        )}

                                        {/* Email */}
                                        <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                                            <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                Email Address
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} className="text-stone-400" />
                                                <input
                                                    type="email"
                                                    {...register('guestEmail')}
                                                    placeholder="john@example.com"
                                                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900"
                                                />
                                            </div>
                                        </div>
                                        {errors.guestEmail && (
                                            <p className="text-xs text-red-500 mt-1">{errors.guestEmail.message}</p>
                                        )}

                                        {/* Phone */}
                                        <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                                            <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                Phone Number
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} className="text-stone-400" />
                                                <input
                                                    type="tel"
                                                    {...register('guestPhone')}
                                                    placeholder="+1 (555) 123-4567"
                                                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900"
                                                />
                                            </div>
                                        </div>
                                        {errors.guestPhone && (
                                            <p className="text-xs text-red-500 mt-1">{errors.guestPhone.message}</p>
                                        )}

                                        {/* Special Requests */}
                                        <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                                            <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                Special Requests (Optional)
                                            </label>
                                            <textarea
                                                {...register('specialRequests')}
                                                rows={3}
                                                placeholder="Any special requests or requirements?"
                                                className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900 resize-none"
                                            />
                                        </div>

                                        <div className="flex gap-4 mt-8">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="flex-1 bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                            >
                                                <ArrowLeft size={16} />
                                                Back
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="flex-1 bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group"
                                            >
                                                Continue
                                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review & Confirm */}
                            {currentStep === 2 && (
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <h1 className="text-4xl md:text-5xl serif font-light text-stone-900 mb-3">
                                        Review & Confirm
                                    </h1>
                                    <p className="text-lg text-stone-600 font-light mb-8">
                                        Please review your booking details
                                    </p>

                                    <div className="space-y-6">
                                        {/* Booking Summary */}
                                        <div className="p-6 rounded-2xl bg-white border border-stone-200">
                                            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#A18058] mb-4">
                                                Booking Details
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-stone-600">Check-in</span>
                                                    <span className="font-medium text-stone-900">
                                                        {checkIn && new Date(checkIn).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-stone-600">Check-out</span>
                                                    <span className="font-medium text-stone-900">
                                                        {checkOut && new Date(checkOut).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-stone-600">Guests</span>
                                                    <span className="font-medium text-stone-900">{guestCount}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Guest Information */}
                                        <div className="p-6 rounded-2xl bg-white border border-stone-200">
                                            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#A18058] mb-4">
                                                Guest Information
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-stone-600">Name</span>
                                                    <span className="font-medium text-stone-900">{watch('guestName')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-stone-600">Email</span>
                                                    <span className="font-medium text-stone-900">{watch('guestEmail')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-stone-600">Phone</span>
                                                    <span className="font-medium text-stone-900">{watch('guestPhone')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Agreements */}
                                        <div className="space-y-4">
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    {...register('agreeToHouseRules')}
                                                    className="mt-1 w-4 h-4 rounded border-stone-300 text-[#A18058] focus:ring-[#A18058]"
                                                />
                                                <span className="text-sm text-stone-700">
                                                    I agree to the{' '}
                                                    <Link href="/house-rules" className="text-[#A18058] hover:underline">
                                                        house rules
                                                    </Link>
                                                </span>
                                            </label>
                                            {errors.agreeToHouseRules && (
                                                <p className="text-xs text-red-500">{errors.agreeToHouseRules.message}</p>
                                            )}

                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    {...register('agreeToCancellationPolicy')}
                                                    className="mt-1 w-4 h-4 rounded border-stone-300 text-[#A18058] focus:ring-[#A18058]"
                                                />
                                                <span className="text-sm text-stone-700">
                                                    I agree to the cancellation policy (flexible cancellation up to 48 hours before check-in)
                                                </span>
                                            </label>
                                            {errors.agreeToCancellationPolicy && (
                                                <p className="text-xs text-red-500">{errors.agreeToCancellationPolicy.message}</p>
                                            )}
                                        </div>

                                        <div className="flex gap-4 mt-8">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="flex-1 bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                            >
                                                <ArrowLeft size={16} />
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 bg-[#A18058] hover:bg-[#8a6a47] text-white py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group"
                                            >
                                                <CheckCircle size={16} />
                                                Confirm Booking
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Side - Pricing Summary */}
                    <div className="lg:w-2/5">
                        <PricingSummary pricing={pricing} checkIn={checkIn} checkOut={checkOut} />
                    </div>
                </div>
            </div>
        </div>
    );
}
