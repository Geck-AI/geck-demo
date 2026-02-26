import { NextResponse } from 'next/server';

// Source of the tracker script (defaults to your local Geck backend)
const TRACKER_URL =
  process.env.GECK_TRACKER_URL || 'http://localhost:3005/tracker.js';

// Backend URL the tracker should send events to.
// This will replace whatever backendUrl the bundled script defines
// (which currently uses http://localhost:3000 for localhost).
const BACKEND_URL =
  process.env.NEXT_PUBLIC_GECK_BACKEND_URL || 'http://localhost:3005';

export async function GET() {
  try {
    const response = await fetch(TRACKER_URL, {
      headers: {
        'User-Agent': 'GeckTrackerProxy/1.0',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return new NextResponse('Tracker script unavailable', { status: 502 });
    }

    let script = await response.text();

    // Force CONFIG.backendUrl to use BACKEND_URL, overriding the default
    // "(location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://api-dev.geck.ai')"
    script = script.replace(
      /backendUrl:\s*[^,]+,/,
      `backendUrl: '${BACKEND_URL}',`
    );

    return new NextResponse(script, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    });
  } catch (error) {
    console.error('[Geck Tracker] Proxy fetch failed:', error);
    return new NextResponse('Tracker script unavailable', { status: 502 });
  }
}
