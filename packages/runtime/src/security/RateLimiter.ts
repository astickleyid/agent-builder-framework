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
export class RateLimiter {
  private config: RateLimitConfig;
  private minuteCounters: Map<string, { count: number; resetTime: number }> = new Map();
  private hourCounters: Map<string, { count: number; resetTime: number }> = new Map();
  private dayCounters: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(config: RateLimitConfig = {}) {
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
  checkLimit(identifier: string): RateLimitResult {
    const now = Date.now();

    // Check minute limit
    if (this.config.requestsPerMinute) {
      const result = this.checkCounter(
        this.minuteCounters,
        identifier,
        this.config.requestsPerMinute,
        60 * 1000,
        now
      );
      if (!result.allowed) return result;
    }

    // Check hour limit
    if (this.config.requestsPerHour) {
      const result = this.checkCounter(
        this.hourCounters,
        identifier,
        this.config.requestsPerHour,
        60 * 60 * 1000,
        now
      );
      if (!result.allowed) return result;
    }

    // Check day limit
    if (this.config.requestsPerDay) {
      const result = this.checkCounter(
        this.dayCounters,
        identifier,
        this.config.requestsPerDay,
        24 * 60 * 60 * 1000,
        now
      );
      if (!result.allowed) return result;
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

  private checkCounter(
    counterMap: Map<string, { count: number; resetTime: number }>,
    identifier: string,
    limit: number,
    windowMs: number,
    now: number
  ): RateLimitResult {
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

  private incrementCounter(
    counterMap: Map<string, { count: number; resetTime: number }>,
    identifier: string,
    windowMs: number,
    now: number
  ): void {
    const data = counterMap.get(identifier);

    if (!data || now > data.resetTime) {
      counterMap.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
    } else {
      data.count++;
    }
  }

  /**
   * Reset limits for an identifier
   */
  reset(identifier: string): void {
    this.minuteCounters.delete(identifier);
    this.hourCounters.delete(identifier);
    this.dayCounters.delete(identifier);
  }

  /**
   * Get current usage for an identifier
   */
  getUsage(identifier: string): {
    minute: number;
    hour: number;
    day: number;
  } {
    const now = Date.now();
    
    return {
      minute: this.getCount(this.minuteCounters, identifier, now),
      hour: this.getCount(this.hourCounters, identifier, now),
      day: this.getCount(this.dayCounters, identifier, now)
    };
  }

  private getCount(
    counterMap: Map<string, { count: number; resetTime: number }>,
    identifier: string,
    now: number
  ): number {
    const data = counterMap.get(identifier);
    if (!data || now > data.resetTime) {
      return 0;
    }
    return data.count;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    
    const cleanMap = (map: Map<string, { count: number; resetTime: number }>) => {
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
  getStats(): {
    activeUsers: number;
    totalRequests: { minute: number; hour: number; day: number };
  } {
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
