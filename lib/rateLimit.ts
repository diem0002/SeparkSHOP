// Simple in-memory rate limiter
const attempts = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT = 5 // Max attempts
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
    const now = Date.now()
    const record = attempts.get(identifier)

    // Clean up expired records
    if (record && now > record.resetAt) {
        attempts.delete(identifier)
    }

    const current = attempts.get(identifier)

    if (!current) {
        attempts.set(identifier, { count: 1, resetAt: now + WINDOW_MS })
        return { allowed: true, remaining: RATE_LIMIT - 1 }
    }

    if (current.count >= RATE_LIMIT) {
        return { allowed: false, remaining: 0 }
    }

    current.count++
    return { allowed: true, remaining: RATE_LIMIT - current.count }
}

export function resetRateLimit(identifier: string) {
    attempts.delete(identifier)
}
