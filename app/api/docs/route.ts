import { NextResponse } from 'next/server';
import { getOpenApiSpec } from '@/lib/openapi';

/**
 * OpenAPI 3.0 Documentation for THE STORE API
 * This endpoint returns the full OpenAPI specification
 * Also available at /api/openapi.json and /openapi.json
 */
export async function GET() {
  const openApiSpec = getOpenApiSpec();
  
  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
