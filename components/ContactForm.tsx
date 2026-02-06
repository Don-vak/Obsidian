'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { contactFormSchema, type ContactFormData } from '@/lib/schemas/contact';

export const ContactForm: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // Mock submission - log to console for now
            console.log('Contact form submission:', data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSubmitStatus('success');
            reset();

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitStatus('idle'), 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-widest text-[#A18058] mb-2">
                        Name *
                    </label>
                    <input
                        {...register('name')}
                        type="text"
                        id="name"
                        className={`w-full px-4 py-3 rounded-xl border transition-colors bg-white ${errors.name
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-stone-200 focus:border-[#A18058]'
                            } outline-none text-sm text-stone-900 placeholder:text-stone-400`}
                        placeholder="Your full name"
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-[#A18058] mb-2">
                        Email *
                    </label>
                    <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className={`w-full px-4 py-3 rounded-xl border transition-colors bg-white ${errors.email
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-stone-200 focus:border-[#A18058]'
                            } outline-none text-sm text-stone-900 placeholder:text-stone-400`}
                        placeholder="your.email@example.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-widest text-stone-600 mb-2">
                        Phone <span className="text-stone-400">(Optional)</span>
                    </label>
                    <input
                        {...register('phone')}
                        type="tel"
                        id="phone"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#A18058] transition-colors bg-white outline-none text-sm text-stone-900 placeholder:text-stone-400"
                        placeholder="+1 (555) 123-4567"
                    />
                </div>

                {/* Subject */}
                <div>
                    <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-widest text-[#A18058] mb-2">
                        Subject *
                    </label>
                    <input
                        {...register('subject')}
                        type="text"
                        id="subject"
                        className={`w-full px-4 py-3 rounded-xl border transition-colors bg-white ${errors.subject
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-stone-200 focus:border-[#A18058]'
                            } outline-none text-sm text-stone-900 placeholder:text-stone-400`}
                        placeholder="How can we assist you?"
                    />
                    {errors.subject && (
                        <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>
                    )}
                </div>

                {/* Message */}
                <div>
                    <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-widest text-[#A18058] mb-2">
                        Message *
                    </label>
                    <textarea
                        {...register('message')}
                        id="message"
                        rows={5}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors bg-white resize-none ${errors.message
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-stone-200 focus:border-[#A18058]'
                            } outline-none text-sm text-stone-900 placeholder:text-stone-400`}
                        placeholder="Tell us about your inquiry..."
                    />
                    {errors.message && (
                        <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1C1917] hover:bg-[#292524] disabled:bg-stone-400 disabled:cursor-not-allowed text-[#FAFAF9] py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group"
                >
                    {isSubmitting ? (
                        'Sending...'
                    ) : (
                        <>
                            Send Message
                            <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-200"
                    >
                        <CheckCircle size={20} className="text-green-600" />
                        <p className="text-sm text-green-800 font-medium">
                            Thank you! We'll respond within 24 hours.
                        </p>
                    </motion.div>
                )}

                {submitStatus === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200"
                    >
                        <AlertCircle size={20} className="text-red-600" />
                        <p className="text-sm text-red-800 font-medium">
                            Something went wrong. Please try again.
                        </p>
                    </motion.div>
                )}

                {/* Reassurance */}
                <p className="text-center text-xs text-stone-600 font-light">
                    We'll respond within 24 hours
                </p>
            </form>
        </div>
    );
};
