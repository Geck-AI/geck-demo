import { NextResponse } from 'next/server';
import { getEnvironment, isStaging, getStagingUrl, getProductionUrl } from '@/lib/environment';

/**
 * GET /api/staging/info
 * Returns staging environment information for partner agents
 */
export async function GET() {
  const environment = getEnvironment();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  
  return NextResponse.json({
    environment,
    isStaging: isStaging(),
    isProduction: environment === 'production',
    isDevelopment: environment === 'development',
    baseUrl,
    stagingUrl: getStagingUrl(),
    productionUrl: getProductionUrl(),
    features: {
      testMode: isStaging() || environment === 'development',
      sandbox: isStaging(),
      apiKeysEnabled: true,
      analyticsEnabled: true,
      rateLimiting: {
        enabled: true,
        limit: isStaging() ? 200 : 60, // More lenient in staging
        window: '1 minute',
      },
    },
    endpoints: {
      apiDocs: `${baseUrl}/api/docs`,
      apiKeys: `${baseUrl}/api/auth/api-keys`,
      products: `${baseUrl}/api/store/styles`,
      search: `${baseUrl}/search`,
      cart: `${baseUrl}/cart`,
    },
    message: isStaging() 
      ? 'This is a staging/test environment. Safe for automated testing.'
      : environment === 'development'
      ? 'This is a development environment.'
      : 'This is a production environment.',
    documentation: {
      api: `${baseUrl}/api/docs`,
      stagingGuide: `${baseUrl}/staging-guide`,
    },
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Environment': environment,
      'X-Is-Staging': isStaging().toString(),
    },
  });
}

