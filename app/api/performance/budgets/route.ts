import { NextResponse } from 'next/server';

/**
 * GET /api/performance/budgets
 * Returns performance budget targets for agent access
 */
export async function GET() {
  return NextResponse.json({
    budgets: {
      lcp: {
        target: 2.5,
        unit: 'seconds',
        description: 'Largest Contentful Paint - Hero content must load fast for agents',
        rationale: 'Agents don\'t scroll, so hero content must be visible immediately',
      },
      inp: {
        target: 200,
        unit: 'milliseconds',
        description: 'Interaction to Next Paint - Agents won\'t wait for slow responses',
        rationale: 'Fast interaction response is critical for automated workflows',
      },
      cls: {
        target: 0.1,
        unit: 'score',
        description: 'Cumulative Layout Shift - Layout shifts break agent DOM parsing',
        rationale: 'Stable layout prevents agent parsing errors',
      },
      ttfb: {
        target: 600,
        unit: 'milliseconds',
        description: 'Time to First Byte - Server response time',
        rationale: 'Fast server response enables quick content delivery',
      },
    },
    optimizations: {
      images: {
        hero: {
          priority: true,
          fetchPriority: 'high',
          format: 'webp',
          quality: 85,
        },
        belowFold: {
          loading: 'lazy',
          fetchPriority: 'low',
        },
      },
      fonts: {
        display: 'swap',
        preload: true,
      },
      resources: {
        preconnect: ['fonts.googleapis.com', 'fonts.gstatic.com'],
        dnsPrefetch: true,
        preload: ['/cover.webp'],
      },
    },
    current: {
      note: 'Performance metrics should be measured using PageSpeed Insights or Lighthouse',
      measurement: 'Use GET /api/performance/metrics (if implemented) or external tools',
    },
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

