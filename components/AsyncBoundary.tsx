'use client'

import { ReactNode, Suspense } from 'react'
import LoadingAnimation from './LoadingAnimation'

interface AsyncBoundaryProps {
    children: ReactNode
    loadingMessage?: string
    fallback?: ReactNode
}

/**
 * Wrapper component that shows loading animation while async data is being fetched
 * Use this to wrap components that fetch data
 */
export default function AsyncBoundary({
    children,
    loadingMessage = 'Loading...',
    fallback
}: AsyncBoundaryProps) {
    return (
        <Suspense
            fallback={
                fallback || <LoadingAnimation message={loadingMessage} fullScreen={false} />
            }
        >
            {children}
        </Suspense>
    )
}
