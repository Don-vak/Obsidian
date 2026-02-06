'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressStepProps {
    steps: string[];
    currentStep: number;
}

export const ProgressIndicator: React.FC<ProgressStepProps> = ({ steps, currentStep }) => {
    return (
        <div className="mb-12">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        {/* Step Circle */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                  ${index < currentStep
                                        ? 'bg-[#A18058] text-white'
                                        : index === currentStep
                                            ? 'bg-[#A18058] text-white ring-4 ring-[#A18058]/20'
                                            : 'bg-stone-200 text-stone-500'
                                    }
                `}
                            >
                                {index < currentStep ? (
                                    <Check size={18} />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </motion.div>
                            <span className={`
                mt-2 text-xs font-medium tracking-wide
                ${index === currentStep ? 'text-[#A18058]' : 'text-stone-500'}
              `}>
                                {step}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="w-24 h-0.5 mx-4 mb-6">
                                <div className={`
                  h-full transition-all duration-500
                  ${index < currentStep ? 'bg-[#A18058]' : 'bg-stone-200'}
                `} />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
