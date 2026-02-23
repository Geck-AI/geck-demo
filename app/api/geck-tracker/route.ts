import { NextResponse } from 'next/server';

const TRACKER_URL = 'https://api-dev.geck.ai/tracker.js';

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

    // Rewrite backendUrl: tracker uses CONFIG.backendUrl + '/tracking/collect'
    // Non-localhost: use '' (same-origin) so it hits our /tracking/collect rewrite -> /api/tracking/collect
    script = script.replace(
      /:\s*['"]https:\/\/dev\.geck\.ai['"]/,
      ": ''"
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
