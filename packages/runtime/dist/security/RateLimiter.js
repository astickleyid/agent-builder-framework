"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
/**
 * RateLimiter - Control request rates per user/agent
 */
class RateLimiter {
    config;
    minuteCounters = new Map();
    hourCounters = new Map();
    dayCounters = new Map();
    constructor(config = {}) {
        this.config = {
            requestsPerMinute: 60,
            requestsPerHour: 1000,
            requestsPerDay: 10000,
            ...config
        };
        // Cleanup old entries every minute
        setInterval(() => this.cleanup(), 60000);
    }
    /**
     * Check if request is allowed
     */
    checkLimit(identifier) {
        const now = Date.now();
        // Check minute limit
        if (this.config.requestsPerMinute) {
            const result = this.checkCounter(this.minuteCounters, identifier, this.config.requestsPerMinute, 60 * 1000, now);
            if (!result.allowed)
                return result;
        }
        // Check hour limit
        if (this.config.requestsPerHour) {
            const result = this.checkCounter(this.hourCounters, identifier, this.config.requestsPerHour, 60 * 60 * 1000, now);
            if (!result.allowed)
                return result;
        }
        // Check day limit
        if (this.config.requestsPerDay) {
            const result = this.checkCounter(this.dayCounters, identifier, this.config.requestsPerDay, 24 * 60 * 60 * 1000, now);
            if (!result.allowed)
                return result;
        }
        // Increment all counters
        this.incrementCounter(this.minuteCounters, identifier, 60 * 1000, now);
        this.incrementCounter(this.hourCounters, identifier, 60 * 60 * 1000, now);
        this.incrementCounter(this.dayCounters, identifier, 24 * 60 * 60 * 1000, now);
        return {
            allowed: true,
            remaining: this.config.requestsPerMinute || 0,
            resetTime: now + 60 * 1000
        };
    }
    checkCounter(counterMap, identifier, limit, windowMs, now) {
        const data = counterMap.get(identifier);
        if (!data || now > data.resetTime) {
            return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
        }
        if (data.count >= limit) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: data.resetTime
            };
        }
        return {
            allowed: true,
            remaining: limit - data.count - 1,
            resetTime: data.resetTime
        };
    }
    incrementCounter(counterMap, identifier, windowMs, now) {
        const data = counterMap.get(identifier);
        if (!data || now > data.resetTime) {
            counterMap.set(identifier, {
                count: 1,
                resetTime: now + windowMs
            });
        }
        else {
            data.count++;
        }
    }
    /**
     * Reset limits for an identifier
     */
    reset(identifier) {
        this.minuteCounters.delete(identifier);
        this.hourCounters.delete(identifier);
        this.dayCounters.delete(identifier);
    }
    /**
     * Get current usage for an identifier
     */
    getUsage(identifier) {
        const now = Date.now();
        return {
            minute: this.getCount(this.minuteCounters, identifier, now),
            hour: this.getCount(this.hourCounters, identifier, now),
            day: this.getCount(this.dayCounters, identifier, now)
        };
    }
    getCount(counterMap, identifier, now) {
        const data = counterMap.get(identifier);
        if (!data || now > data.resetTime) {
            return 0;
        }
        return data.count;
    }
    /**
     * Clean up expired entries
     */
    cleanup() {
        const now = Date.now();
        const cleanMap = (map) => {
            for (const [key, data] of map.entries()) {
                if (now > data.resetTime) {
                    map.delete(key);
                }
            }
        };
        cleanMap(this.minuteCounters);
        cleanMap(this.hourCounters);
        cleanMap(this.dayCounters);
    }
    /**
     * Get statistics
     */
    getStats() {
        const activeUsers = new Set([
            ...this.minuteCounters.keys(),
            ...this.hourCounters.keys(),
            ...this.dayCounters.keys()
        ]).size;
        let totalMinute = 0;
        let totalHour = 0;
        let totalDay = 0;
        this.minuteCounters.forEach(data => totalMinute += data.count);
        this.hourCounters.forEach(data => totalHour += data.count);
        this.dayCounters.forEach(data => totalDay += data.count);
        return {
            activeUsers,
            totalRequests: { minute: totalMinute, hour: totalHour, day: totalDay }
        };
    }
}
exports.RateLimiter = RateLimiter;
//# sourceMappingURL=RateLimiter.js.map