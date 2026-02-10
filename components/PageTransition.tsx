'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import LoadingAnimation from './LoadingAnimation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(false)
    const [displayChildren, setDisplayChildren] = useState(children)

    useEffect(() => {
        // Show loading animation when route changes
        setIsLoading(true)

        // Simulate waiting for data to load
        const timer = setTimeout(() => {
            setDisplayChildren(children)
            setIsLoading(false)
        }, 300) // Short delay to ensure smooth transition

        return () => clearTimeout(timer)
    }, [pathname, children])

    if (isLoading) {
        return <LoadingAnimation message="Preparing your experience..." />
    }

    return <>{displayChildren}</>
}
