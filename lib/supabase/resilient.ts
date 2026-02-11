/**
 * Resilient Supabase Query
 * 
 * Combines all three resilience patterns into one easy-to-use function:
 * 1. Cache — serve cached data instantly, avoid unnecessary DB calls
 * 2. Circuit Breaker — stop hammering a down service
 * 3. Retry with Backoff — handle transient failures gracefully
 * 
 * Usage:
 * const { data, error, fromCache } = await resilientQuery(
 *   'blocked-dates',
 *   () => supabase.from('blocked_dates').select('*'),
 *   { cacheTTL: CACHE_TTL.MEDIUM }
 * )
 */

import { retrySupabaseQuery } from './retry'
import { cache, CACHE_TTL, fetchWithCache } from './cache'
import { supabaseCircuit, CircuitOpenError } from './circuit-breaker'

interface ResilientQueryOptions {
    /** Cache TTL in ms. Set to 0 to disable caching. */
    cacheTTL?: number
    /** Max retry attempts (default: 3) */
    maxRetries?: number
    /** Whether to use circuit breaker (default: true) */
    useCircuitBreaker?: boolean
}

/**
 * Execute a Supabase query with full resilience:
 * cache → circuit breaker → retry with backoff → stale cache fallback
 */
export async function resilientQuery<T>(
    cacheKey: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: () => PromiseLike<{ data: T; error: any }>,
    operationName: string,
    options: ResilientQueryOptions = {}
): Promise<{
    data: T | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any
    fromCache: boolean
}> {
    const {
        cacheTTL = CACHE_TTL.MEDIUM,
        maxRetries = 3,
        useCircuitBreaker = true,
    } = options

    // 1. Check fresh cache first
    if (cacheTTL > 0) {
        const cached = cache.get<T>(cacheKey)
        if (cached !== undefined) {
            return { data: cached, error: null, fromCache: true }
        }
    }

    // 2. Execute through circuit breaker + retry
    try {
        const executeFn = async () => {
            const result = await retrySupabaseQuery(queryFn, operationName, { maxRetries })
            return result
        }

        const result = useCircuitBreaker
            ? await supabaseCircuit.execute(executeFn)
            : await executeFn()

        // 3. Cache successful results
        if (!result.error && result.data && cacheTTL > 0) {
            cache.set(cacheKey, result.data, cacheTTL)
        }

        return { ...result, fromCache: false }
    } catch (error) {
        // 4. If circuit is open or all retries failed, try stale cache
        if (cacheTTL > 0) {
            const stale = cache.get<T>(cacheKey, true) // allowStale = true
            if (stale !== undefined) {
                console.warn(`[Resilient] Serving stale cache for "${cacheKey}"`)
                return { data: stale, error: null, fromCache: true }
            }
        }

        // 5. No cache available — return error
        if (error instanceof CircuitOpenError) {
            return {
                data: null,
                error: { message: error.message, retryAfterSeconds: error.retryAfterSeconds },
                fromCache: false,
            }
        }

        return {
            data: null,
            error: { message: error instanceof Error ? error.message : 'Unknown error' },
            fromCache: false,
        }
    }
}

// Re-export for convenience
export { cache, CACHE_TTL } from './cache'
export { supabaseCircuit, CircuitOpenError } from './circuit-breaker'
export { retrySupabaseQuery, retryWithBackoff } from './retry'
