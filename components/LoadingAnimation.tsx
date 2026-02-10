'use client'

import { motion } from 'framer-motion'

interface LoadingAnimationProps {
    message?: string
    fullScreen?: boolean
}

export default function LoadingAnimation({
    message = 'Loading...',
    fullScreen = true
}: LoadingAnimationProps) {
    return (
        <div className={`
            ${fullScreen ? 'fixed inset-0' : 'absolute inset-0'}
            flex flex-col items-center justify-center
            bg-stone-50 dark:bg-stone-950
            z-50
        `}>
            {/* Animated Logo */}
            <div className="relative">
                {/* Outer rotating ring */}
                <motion.div
                    className="absolute inset-0 w-24 h-24 border-2 border-amber-700/20 rounded-full"
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        rotate: {
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                        },
                        scale: {
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        },
                    }}
                />

                {/* Inner pulsing circle */}
                <motion.div
                    className="absolute inset-0 w-24 h-24 flex items-center justify-center"
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full shadow-lg" />
                </motion.div>

                {/* Center logo text */}
                <div className="absolute inset-0 w-24 h-24 flex items-center justify-center">
                    <motion.span
                        className="text-2xl font-light text-stone-50 tracking-widest"
                        animate={{
                            opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        O
                    </motion.span>
                </div>

                {/* Shimmer effect */}
                <motion.div
                    className="absolute inset-0 w-24 h-24 rounded-full overflow-hidden"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    }}
                    animate={{
                        x: [-100, 100],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>

            {/* Loading message */}
            <motion.p
                className="mt-8 text-stone-600 dark:text-stone-400 font-light tracking-wide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {message}
            </motion.p>

            {/* Loading dots */}
            <div className="flex gap-2 mt-4">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 bg-amber-700 rounded-full"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
