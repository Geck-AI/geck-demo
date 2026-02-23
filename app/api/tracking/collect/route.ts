import { NextRequest, NextResponse } from 'next/server';

const GECK_COLLECT_URL =
  process.env.GECK_TRACKING_COLLECT_URL ||
  'https://api-dev.geck.ai/tracking/collect';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward to Geck backend (use GECK_TRACKING_COLLECT_URL for local dev)
    const response = await fetch(GECK_COLLECT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(
          Array.from(request.headers.entries()).filter(([key]) =>
            ['user-agent', 'referer', 'origin'].includes(key.toLowerCase())
          )
        ),
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : { ok: response.ok };

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Tracking proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to forward tracking request' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
