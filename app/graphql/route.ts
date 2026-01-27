import { NextResponse } from 'next/server';

/**
 * GraphQL Schema Endpoint (root level)
 * Returns the GraphQL schema in SDL format
 * Accessible at /graphql
 */
export async function GET() {
  // Redirect to /api/graphql or return the same schema
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  
  return NextResponse.redirect(`${baseUrl}/api/graphql`, {
    status: 301,
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

