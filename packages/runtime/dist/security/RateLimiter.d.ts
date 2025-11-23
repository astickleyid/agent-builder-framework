export interface RateLimitConfig {
    requestsPerMinute?: number;
    requestsPerHour?: number;
    requestsPerDay?: number;
}
export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
}
/**
 * RateLimiter - Control request rates per user/agent
 */
export declare class RateLimiter {
    private config;
    private minuteCounters;
    private hourCounters;
    private dayCounters;
    constructor(config?: RateLimitConfig);
    /**
     * Check if request is allowed
     */
    checkLimit(identifier: string): RateLimitResult;
    private checkCounter;
    private incrementCounter;
    /**
     * Reset limits for an identifier
     */
    reset(identifier: string): void;
    /**
     * Get current usage for an identifier
     */
    getUsage(identifier: string): {
        minute: number;
        hour: number;
        day: number;
    };
    private getCount;
    /**
     * Clean up expired entries
     */
    private cleanup;
    /**
     * Get statistics
     */
    getStats(): {
        activeUsers: number;
        totalRequests: {
            minute: number;
            hour: number;
            day: number;
        };
    };
}
//# sourceMappingURL=RateLimiter.d.ts.map