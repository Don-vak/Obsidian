/**
 * Retry utility with exponential backoff and jitter
 * Handles transient network failures (timeouts, connection errors)
 */

interface RetryOptions {
    /** Maximum number of retry attempts (default: 3) */
    maxRetries?: number
    /** Initial delay in milliseconds (default: 1000) */
    initialDelay?: number
    /** Maximum delay in milliseconds (default: 10000) */
    maxDelay?: number
    /** Backoff multiplier (default: 2) */
    backoffMultiplier?: number
    /** Operation name for logging */
    operationName?: string
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    operationName: 'operation',
}

/**
 * Check if an error is retryable (network/timeout errors)
 */
function isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
        const message = error.message.toLowerCase()
        return (
            message.includes('fetch failed') ||
            message.includes('connect timeout') ||
            message.includes('econnrefused') ||
            message.includes('econnreset') ||
            message.includes('epipe') ||
            message.includes('etimedout') ||
            message.includes('und_err_connect_timeout') ||
            message.includes('network') ||
            message.includes('socket hang up')
        )
    }
    return false
}

/**
 * Add jitter to prevent thundering herd problem
 */
function addJitter(delay: number): number {
    return delay * (0.5 + Math.random())
}

/**
 * Execute a function with retry logic and exponential backoff.
 * 
 * @example
 * const data = await retryWithBackoff(
 *   () => supabase.from('blocked_dates').select('*'),
 *   { operationName: 'fetch-blocked-dates', maxRetries: 3 }
 * )
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T> | PromiseLike<T>,
    options?: RetryOptions
): Promise<T> {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    let lastError: unknown
    let delay = opts.initialDelay

    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
        try {
            const result = await fn()
            if (attempt > 0) {
                console.log(`[Retry] ${opts.operationName} succeeded on attempt ${attempt + 1}`)
            }
            return result
        } catch (error) {
            lastError = error

            if (!isRetryableError(error)) {
                throw error
            }

            if (attempt === opts.maxRetries) {
                console.error(
                    `[Retry] ${opts.operationName} failed after ${opts.maxRetries + 1} attempts:`,
                    error instanceof Error ? error.message : error
                )
                throw error
            }

            const actualDelay = Math.min(addJitter(delay), opts.maxDelay)
            console.warn(
                `[Retry] ${opts.operationName} attempt ${attempt + 1} failed, ` +
                `retrying in ${Math.round(actualDelay)}ms...`
            )

            await new Promise(resolve => setTimeout(resolve, actualDelay))
            delay *= opts.backoffMultiplier
        }
    }

    throw lastError
}

/**
 * Wrapper for Supabase queries with built-in retry.
 * Handles both Supabase query builders (thenable) and regular Promises.
 * 
 * Supabase query builders like `supabase.from('table').select('*')` are
 * "thenable" objects — they implement `.then()` but aren't actual Promises.
 * This wrapper handles that by awaiting the result of the callback.
 * 
 * @example
 * const { data, error } = await retrySupabaseQuery(
 *   () => supabase.from('table').select('*'),
 *   'fetch-table-data'
 * )
 */
export async function retrySupabaseQuery<T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: () => PromiseLike<{ data: T; error: any }>,
    operationName: string,
    options?: Omit<RetryOptions, 'operationName'>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ data: T; error: any }> {
    return retryWithBackoff(async () => {
        const result = await queryFn()

        // If Supabase returns an error that looks like a connection issue, throw to trigger retry
        if (result.error) {
            const msg = (result.error.message || '').toLowerCase()
            const details = (result.error.details || '').toLowerCase()
            if (
                msg.includes('fetch failed') ||
                msg.includes('timeout') ||
                details.includes('connect timeout') ||
                details.includes('und_err_connect_timeout')
            ) {
                throw new Error(result.error.details || result.error.message)
            }
        }

        return result
    }, { ...options, operationName })
}
