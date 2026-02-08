'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Users, Mail, Phone, User, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { PricingSummary } from '@/components/PricingSummary';
import { bookingFormSchema, type BookingFormData } from '@/lib/schemas/booking';
import { type PricingBreakdown } from '@/lib/mock-data/pricing';
import Link from 'next/link';

const steps = ['Dates & Guests', 'Guest Information', 'Review & Confirm', 'Payment'];

export default function BookingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState(0);
    const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
    const [availabilityError, setAvailabilityError] = useState<string>('');
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

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

    // Pre-fill form from URL parameters
    useEffect(() => {
        const checkInParam = searchParams.get('checkIn');
        const checkOutParam = searchParams.get('checkOut');
        const guestsParam = searchParams.get('guests');

        if (checkInParam) setValue('checkIn', checkInParam);
        if (checkOutParam) setValue('checkOut', checkOutParam);
        if (guestsParam) setValue('guestCount', parseInt(guestsParam));
    }, [searchParams, setValue]);

    // Calculate pricing when dates change
    useEffect(() => {
        if (checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

            if (nights > 0) {
                setIsCheckingAvailability(true);

                // Check availability via API
                fetch(`/api/availability?checkIn=${checkIn}&checkOut=${checkOut}`)
                    .then(res => res.json())
                    .then(availability => {
                        if (!availability.available) {
                            setAvailabilityError(availability.message);
                            setPricing(null);
                            setIsCheckingAvailability(false);
                        } else {
                            setAvailabilityError('');

                            // Calculate pricing via API
                            return fetch(`/api/pricing/calculate?nights=${nights}`);
                        }
                    })
                    .then(res => res?.json())
                    .then(calculatedPricing => {
                        if (calculatedPricing) {
                            setPricing(calculatedPricing);
                        }
                        setIsCheckingAvailability(false);
                    })
                    .catch(error => {
                        console.error('Error checking availability/pricing:', error);
                        setAvailabilityError('Error checking availability. Please try again.');
                        setIsCheckingAvailability(false);
                    });
            }
        }
    }, [checkIn, checkOut]);

    const onSubmit = async (data: BookingFormData) => {
        try {
            // Submit booking to API
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create booking');
            }

            // Map database fields (snake_case) to success page fields (camelCase)
            const booking = result.booking;
            sessionStorage.setItem('bookingData', JSON.stringify({
                bookingId: booking.booking_number,
                guestName: booking.guest_name,
                guestEmail: booking.guest_email,
                guestPhone: booking.guest_phone,
                checkIn: booking.check_in,
                checkOut: booking.check_out,
                guestCount: booking.guest_count,
                specialRequests: booking.special_requests,
                pricing,
            }));

            // Redirect to success page
            router.push('/booking-success');
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to create booking. Please try again.');
        }
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
        <div className="min-h-screen bg-[#FAFAF9] pt-20">
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
                                                type="button"
                                                onClick={nextStep}
                                                className="flex-1 bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group"
                                            >
                                                Continue to Payment
                                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Step 4: Payment */}
                            {currentStep === 3 && (
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <h1 className="text-4xl md:text-5xl serif font-light text-stone-900 mb-3">
                                        Payment Details
                                    </h1>
                                    <p className="text-lg text-stone-600 font-light mb-8">
                                        Secure your reservation with payment
                                    </p>

                                    <div className="space-y-6">
                                        {/* Card Number */}
                                        <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                                            <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                {...register('cardNumber')}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900"
                                            />
                                        </div>
                                        {errors.cardNumber && (
                                            <p className="text-xs text-red-500 mt-1">{errors.cardNumber.message}</p>
                                        )}

                                        {/* Card Expiry & CVV */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                                                    <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('cardExpiry')}
                                                        placeholder="MM/YY"
                                                        maxLength={5}
                                                        className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900"
                                                    />
                                                </div>
                                                {errors.cardExpiry && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.cardExpiry.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                                                    <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                        CVV
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('cardCvv')}
                                                        placeholder="123"
                                                        maxLength={4}
                                                        className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900"
                                                    />
                                                </div>
                                                {errors.cardCvv && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.cardCvv.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Cardholder Name */}
                                        <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                                            <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                Cardholder Name
                                            </label>
                                            <input
                                                type="text"
                                                {...register('cardName')}
                                                placeholder="John Doe"
                                                className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900"
                                            />
                                        </div>
                                        {errors.cardName && (
                                            <p className="text-xs text-red-500 mt-1">{errors.cardName.message}</p>
                                        )}

                                        {/* Billing Address */}
                                        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
                                            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#A18058] mb-4">
                                                Billing Address
                                            </h3>

                                            <div className="space-y-4">
                                                <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                                                    <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                        Street Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('billingAddress')}
                                                        placeholder="123 Main Street"
                                                        className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900"
                                                    />
                                                </div>
                                                {errors.billingAddress && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.billingAddress.message}</p>
                                                )}

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                                                            <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                                City
                                                            </label>
                                                            <input
                                                                type="text"
                                                                {...register('billingCity')}
                                                                placeholder="Los Angeles"
                                                                className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900"
                                                            />
                                                        </div>
                                                        {errors.billingCity && (
                                                            <p className="text-xs text-red-500 mt-1">{errors.billingCity.message}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                                                            <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
                                                                ZIP Code
                                                            </label>
                                                            <input
                                                                type="text"
                                                                {...register('billingZip')}
                                                                placeholder="90210"
                                                                className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900"
                                                            />
                                                        </div>
                                                        {errors.billingZip && (
                                                            <p className="text-xs text-red-500 mt-1">{errors.billingZip.message}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Security Notice */}
                                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#A18058]/5 border border-[#A18058]/20">
                                            <CheckCircle size={20} className="text-[#A18058] flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-stone-900 mb-1">
                                                    Secure Payment
                                                </p>
                                                <p className="text-xs text-stone-600 leading-relaxed">
                                                    Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
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
                                                Complete Booking
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
                        {currentStep < 3 && (
                            <p className="text-center text-xs text-stone-600 font-light mt-4">
                                You won't be charged yet
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
