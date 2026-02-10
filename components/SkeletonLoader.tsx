'use client'

import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
    type?: 'card' | 'list' | 'text' | 'calendar'
    count?: number
}

export default function SkeletonLoader({ type = 'card', count = 1 }: SkeletonLoaderProps) {
    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return (
                    <div className="bg-white dark:bg-stone-900 rounded-lg p-6 shadow-sm">
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
                            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
                            <div className="h-20 bg-stone-200 dark:bg-stone-800 rounded" />
                        </div>
                    </div>
                )

            case 'list':
                return (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="animate-pulse flex items-center gap-4">
                                <div className="h-12 w-12 bg-stone-200 dark:bg-stone-800 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
                                    <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                )

            case 'text':
                return (
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-full" />
                        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-5/6" />
                        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-4/6" />
                    </div>
                )

            case 'calendar':
                return (
                    <div className="bg-white dark:bg-stone-900 rounded-lg p-6 shadow-sm">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded w-1/3 mx-auto" />
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: 35 }).map((_, i) => (
                                    <div key={i} className="h-12 bg-stone-200 dark:bg-stone-800 rounded" />
                                ))}
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
        >
            {Array.from({ length: count }).map((_, i) => (
                <div key={i}>{renderSkeleton()}</div>
            ))}
        </motion.div>
    )
}
