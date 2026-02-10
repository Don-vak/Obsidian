/**
 * Circuit Breaker Pattern
 * 
 * Prevents cascading failures by stopping requests to a failing service.
 * 
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Service is down, requests are immediately rejected
 * - HALF_OPEN: Testing if service has recovered
 * 
 * Flow:
 * CLOSED → (failures > threshold) → OPEN → (timeout expires) → HALF_OPEN
 * HALF_OPEN → (success) → CLOSED
 * HALF_OPEN → (failure) → OPEN
 */

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

interface CircuitBreakerOptions {
    /** Number of failures before opening circuit (default: 5) */
    failureThreshold?: number
    /** Time in ms before attempting recovery (default: 30000 = 30s) */
    resetTimeout?: number
    /** Name for logging */
    name?: string
}

const DEFAULT_CB_OPTIONS: Required<CircuitBreakerOptions> = {
    failureThreshold: 5,
    resetTimeout: 30000,
    name: 'default',
}

class CircuitBreaker {
    private state: CircuitState = 'CLOSED'
    private failureCount = 0
    private lastFailureTime = 0
    private successCount = 0
    private readonly options: Required<CircuitBreakerOptions>

    constructor(options?: CircuitBreakerOptions) {
        this.options = { ...DEFAULT_CB_OPTIONS, ...options }
    }

    /**
     * Execute a function through the circuit breaker.
     * Throws CircuitOpenError if the circuit is open.
     */
    async execute<T>(fn: () => Promise<T>): Promise<T> {
        // Check if circuit should transition from OPEN to HALF_OPEN
        if (this.state === 'OPEN') {
            const elapsed = Date.now() - this.lastFailureTime
            if (elapsed >= this.options.resetTimeout) {
                this.state = 'HALF_OPEN'
                this.successCount = 0
                console.log(`[CircuitBreaker:${this.options.name}] Transitioning to HALF_OPEN`)
            } else {
                const remainingSec = Math.ceil((this.options.resetTimeout - elapsed) / 1000)
                throw new CircuitOpenError(
                    `Service temporarily unavailable. Retrying automatically in ${remainingSec}s.`,
                    remainingSec
                )
            }
        }

        try {
            const result = await fn()
            this.onSuccess()
            return result
        } catch (error) {
            this.onFailure()
            throw error
        }
    }

    private onSuccess(): void {
        if (this.state === 'HALF_OPEN') {
            this.successCount++
            // Require 2 consecutive successes before fully closing
            if (this.successCount >= 2) {
                this.state = 'CLOSED'
                this.failureCount = 0
                console.log(`[CircuitBreaker:${this.options.name}] Circuit CLOSED (service recovered)`)
            }
        } else {
            this.failureCount = 0
        }
    }

    private onFailure(): void {
        this.failureCount++
        this.lastFailureTime = Date.now()

        if (this.state === 'HALF_OPEN') {
            this.state = 'OPEN'
            console.warn(`[CircuitBreaker:${this.options.name}] Circuit OPEN (recovery failed)`)
        } else if (this.failureCount >= this.options.failureThreshold) {
            this.state = 'OPEN'
            console.warn(
                `[CircuitBreaker:${this.options.name}] Circuit OPEN ` +
                `(${this.failureCount} failures, will retry in ${this.options.resetTimeout / 1000}s)`
            )
        }
    }

    /** Get current circuit state for monitoring */
    getState(): { state: CircuitState; failures: number; lastFailure: number } {
        return {
            state: this.state,
            failures: this.failureCount,
            lastFailure: this.lastFailureTime,
        }
    }
}

/**
 * Custom error thrown when the circuit is open.
 */
export class CircuitOpenError extends Error {
    public readonly retryAfterSeconds: number

    constructor(message: string, retryAfterSeconds: number) {
        super(message)
        this.name = 'CircuitOpenError'
        this.retryAfterSeconds = retryAfterSeconds
    }
}

// Singleton circuit breaker for Supabase connections
export const supabaseCircuit = new CircuitBreaker({
    name: 'supabase',
    failureThreshold: 5,
    resetTimeout: 30000, // 30 seconds
})
