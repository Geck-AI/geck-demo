import { NextRequest, NextResponse } from 'next/server';
import { detectAgent } from '@/lib/agentDetection';
import { isStaging, getEnvironment } from '@/lib/environment';

/** Base URL for internal API calls (avoids infinite loop when calling /api/bot-log from same origin). */
function getBaseUrl(request: NextRequest): string {
  return process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// In-memory rate limiting store (in production, use Redis or similar)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Get rate limit key from request (IP address)
 */
function getRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';
  return ip;
}

/**
 * Check rate limit and return whether request should be allowed
 */
function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    // Create new window
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  // Increment count
  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

export async function middleware(request: NextRequest) {
  // Detect agent from user agent
  const userAgent = request.headers.get('user-agent') || '';
  const agent = detectAgent(userAgent);
  const pathname = request.nextUrl.pathname;

  // Get environment info once at the top
  const environment = getEnvironment();
  const isStagingEnv = isStaging();

  // Bot/crawler/scraper logging: POST to /api/bot-log (skip /api/bot-log to avoid infinite loop)
  // Logs any detected agent: AI bots, search engines, generic bot/crawler/spider/scraper patterns
  // In development, ?_log_bot=1 forces a log entry for testing
  const forceLogBot =
    process.env.NODE_ENV !== 'production' &&
    request.nextUrl.searchParams.get('_log_bot') === '1';
  const shouldLogBot =
    !pathname.startsWith('/api/bot-log') &&
    (agent.isAgent || forceLogBot);

  if (shouldLogBot) {
    const ip = getRateLimitKey(request);
    const baseUrl = getBaseUrl(request);
    fetch(`${baseUrl}/api/bot-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip, userAgent, path: pathname, method: request.method }),
    }).catch(() => {
      // Fire-and-forget; do not block the request
    });
  }

  // Rate limiting for API routes only (not read-only pages)
  // Read-only pages (homepage, product pages, FAQ, guides) should never be rate limited
  const isApiRoute = pathname.startsWith('/api/');

  // Apply rate limiting only to API routes (excluding analytics and auth routes)
  if (isApiRoute && 
      !pathname.startsWith('/api/analytics/') && 
      !pathname.startsWith('/api/auth/') &&
      !pathname.startsWith('/api/docs')) {
    const rateLimitKey = getRateLimitKey(request);
    
    // More lenient limits for known AI bots and staging environment
    const isAIBot = agent.isAgent && (agent.type === 'ai_bot' || agent.type === 'search_engine');
    // Staging: 200 req/min, Production bots: 100 req/min, Production users: 60 req/min
    const limit = isStagingEnv ? 200 : (isAIBot ? 100 : 60);
    const windowMs = 60 * 1000; // 1 minute window

    const rateLimit = checkRateLimit(rateLimitKey, limit, windowMs);

    if (!rateLimit.allowed) {
      // Return HTTP 429 (Too Many Requests) - NOT 403 (Forbidden)
      const response = NextResponse.json(
        { 
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        { status: 429 }
      );

      // Set rate limit headers
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetAt).toISOString());
      response.headers.set('Retry-After', Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString());

      // Still add agent detection headers even for rate-limited requests
      response.headers.set('X-Agent-Name', agent.name);
      response.headers.set('X-Agent-Type', agent.type);
      response.headers.set('X-Is-Agent', agent.isAgent.toString());

      return response;
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetAt).toISOString());
    response.headers.set('X-Agent-Name', agent.name);
    response.headers.set('X-Agent-Type', agent.type);
    response.headers.set('X-Is-Agent', agent.isAgent.toString());
    
    // Add staging/environment detection headers
    response.headers.set('X-Environment', environment);
    response.headers.set('X-Is-Staging', isStagingEnv.toString());
    response.headers.set('X-Test-Mode', (isStagingEnv || environment === 'development').toString());
    response.headers.set('X-Sandbox-Mode', isStagingEnv.toString());
    response.headers.set('X-Sandbox-Available', isStagingEnv.toString());
    if (isStagingEnv) {
      response.headers.set('X-Sandbox-Endpoint', '/api/sandbox');
    }

    // Log agent visits (fire and forget - don't block request)
    if (agent.isAgent && !pathname.startsWith('/api/analytics')) {
      const analyticsUrl = new URL('/api/analytics/agent-visit', request.nextUrl.origin);
      fetch(analyticsUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: pathname + request.nextUrl.search,
          userAgent,
          referer: request.headers.get('referer') || undefined,
          ip: rateLimitKey,
        }),
      }).catch(() => {
        // Silently fail - don't block request if analytics fails
      });
    }

    return response;
  }

  // For read-only pages and excluded API routes, no rate limiting
  // Log agent visits (fire and forget - don't block request)
  if (agent.isAgent && !pathname.startsWith('/api/analytics')) {
    const analyticsUrl = new URL('/api/analytics/agent-visit', request.nextUrl.origin);
    fetch(analyticsUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: pathname + request.nextUrl.search,
        userAgent,
        referer: request.headers.get('referer') || undefined,
        ip: getRateLimitKey(request),
      }),
    }).catch(() => {
      // Silently fail - don't block request if analytics fails
    });
  }

  // Add agent detection headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Agent-Name', agent.name);
  response.headers.set('X-Agent-Type', agent.type);
  response.headers.set('X-Is-Agent', agent.isAgent.toString());
  
  // Add staging/environment detection headers
  response.headers.set('X-Environment', environment);
  response.headers.set('X-Is-Staging', isStagingEnv.toString());
  response.headers.set('X-Test-Mode', (isStagingEnv || environment === 'development').toString());
  response.headers.set('X-Sandbox-Mode', isStagingEnv.toString());
  response.headers.set('X-Sandbox-Available', isStagingEnv.toString());
  if (isStagingEnv) {
    response.headers.set('X-Sandbox-Endpoint', '/api/sandbox');
  }

  return response;
}
