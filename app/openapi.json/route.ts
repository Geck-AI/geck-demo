import { NextResponse } from 'next/server';
import { getOpenApiSpec } from '@/lib/openapi';

/**
 * OpenAPI 3.0 Specification Endpoint
 * Returns the OpenAPI specification in JSON format
 * Accessible at /openapi.json
 */
export async function GET() {
  const openApiSpec = getOpenApiSpec();
  
  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

