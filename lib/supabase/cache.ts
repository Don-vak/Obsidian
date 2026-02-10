/**
 * In-memory cache with TTL (Time-To-Live) support.
 * Serves stale data when the database is unavailable,
 * reducing load on Supabase and improving response times.
 */

interface CacheEntry<T> {
    data: T
    timestamp: number
    ttl: number
}

class MemoryCache {
    private cache = new Map<string, CacheEntry<unknown>>()

    /**
     * Get a cached value. Returns undefined if not found or expired.
     * If `allowStale` is true, returns expired data as a fallback.
     */
    get<T>(key: string, allowStale = false): T | undefined {
        const entry = this.cache.get(key) as CacheEntry<T> | undefined
        if (!entry) return undefined

        const isExpired = Date.now() - entry.timestamp > entry.ttl
        if (isExpired && !allowStale) return undefined

        return entry.data
    }

    /**
     * Set a cached value with a TTL in milliseconds.
     */
    set<T>(key: string, data: T, ttlMs: number): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlMs,
        })
    }

    /**
     * Check if a key exists and is not expired.
     */
    has(key: string): boolean {
        const entry = this.cache.get(key)
        if (!entry) return false
        return Date.now() - entry.timestamp <= entry.ttl
    }

    /**
     * Check if a key exists (even if expired).
     */
    hasStale(key: string): boolean {
        return this.cache.has(key)
    }

    /**
     * Delete a specific cache entry.
     */
    delete(key: string): void {
        this.cache.delete(key)
    }

    /**
     * Clear all cache entries.
     */
    clear(): void {
        this.cache.clear()
    }

    /**
     * Remove all expired entries.
     */
    prune(): void {
        const now = Date.now()
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key)
            }
        }
    }
}

// Singleton cache instance
export const cache = new MemoryCache()

// Common TTL constants
export const CACHE_TTL = {
    /** 5 minutes — for data that changes infrequently (pricing config) */
    LONG: 5 * 60 * 1000,
    /** 2 minutes — for moderately dynamic data (blocked dates) */
    MEDIUM: 2 * 60 * 1000,
    /** 30 seconds — for frequently changing data */
    SHORT: 30 * 1000,
} as const

/**
 * Fetch data with cache-first strategy.
 * 1. Check cache → return if fresh
 * 2. Fetch from source
 * 3. If fetch fails, return stale cache data (if available)
 * 4. If no stale data, throw the error
 */
export async function fetchWithCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlMs: number = CACHE_TTL.MEDIUM
): Promise<{ data: T; fromCache: boolean }> {
    // 1. Check for fresh cache
    const cached = cache.get<T>(key)
    if (cached !== undefined) {
        return { data: cached, fromCache: true }
    }

    // 2. Try fetching fresh data
    try {
        const data = await fetchFn()
        cache.set(key, data, ttlMs)
        return { data, fromCache: false }
    } catch (error) {
        // 3. If fetch fails, try stale cache
        const stale = cache.get<T>(key, true)
        if (stale !== undefined) {
            console.warn(`[Cache] Serving stale data for "${key}" due to fetch error`)
            return { data: stale, fromCache: true }
        }

        // 4. No stale data available, rethrow
        throw error
    }
}
