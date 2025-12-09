/**
 * Rate limiting utility for API routes
 * Provides standard rate limit headers following RFC 6585
 */

export interface RateLimitConfig {
  limit: number; // Maximum number of requests
  window: number; // Time window in seconds
  remaining?: number; // Remaining requests (calculated)
}

export function getRateLimitHeaders(config: RateLimitConfig): Headers {
  const headers = new Headers();
  
  // X-RateLimit-Limit: Maximum number of requests allowed
  headers.set('X-RateLimit-Limit', config.limit.toString());
  
  // X-RateLimit-Remaining: Number of requests remaining in current window
  const remaining = config.remaining ?? config.limit;
  headers.set('X-RateLimit-Remaining', remaining.toString());
  
  // X-RateLimit-Reset: Time when the rate limit window resets (Unix timestamp)
  const resetTime = Math.floor(Date.now() / 1000) + config.window;
  headers.set('X-RateLimit-Reset', resetTime.toString());
  
  // Retry-After: Seconds to wait before retrying (if rate limited)
  if (remaining <= 0) {
    headers.set('Retry-After', config.window.toString());
  }
  
  return headers;
}

/**
 * Get rate limit headers for different endpoint types
 */
export function getRateLimitHeadersForEndpoint(endpoint: string): Headers {
  // Different rate limits for different endpoint types
  if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
    // Authentication endpoints: 5 requests per minute
    return getRateLimitHeaders({
      limit: 5,
      window: 60,
      remaining: 5, // In production, this would be calculated based on actual rate limiting
    });
  } else if (endpoint.includes('/auth/otp')) {
    // OTP endpoints: 3 requests per minute
    return getRateLimitHeaders({
      limit: 3,
      window: 60,
      remaining: 3,
    });
  } else if (endpoint.includes('/api/auth/api-keys')) {
    // API key endpoints: 10 requests per minute
    return getRateLimitHeaders({
      limit: 10,
      window: 60,
      remaining: 10,
    });
  } else if (endpoint.includes('/feedback') || endpoint.includes('/analytics')) {
    // Feedback and analytics: 20 requests per minute
    return getRateLimitHeaders({
      limit: 20,
      window: 60,
      remaining: 20,
    });
  } else if (endpoint.includes('/store/styles') || endpoint.includes('/services/orders')) {
    // Product and order endpoints: 100 requests per minute
    return getRateLimitHeaders({
      limit: 100,
      window: 60,
      remaining: 100,
    });
  } else {
    // Default: 60 requests per minute
    return getRateLimitHeaders({
      limit: 60,
      window: 60,
      remaining: 60,
    });
  }
}

