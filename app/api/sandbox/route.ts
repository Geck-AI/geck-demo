import { NextResponse } from 'next/server';
import { getEnvironment, isStaging, getStagingUrl, getProductionUrl } from '@/lib/environment';
import { getRateLimitHeadersForEndpoint } from '@/lib/rateLimit';

/**
 * Sandbox Endpoint for Automated Testing
 * Provides a safe testing environment for partner agents and automation tools
 * 
 * GET /api/sandbox - Get sandbox information and status
 * POST /api/sandbox/test - Execute a test operation in sandbox mode
 */
export async function GET() {
  const environment = getEnvironment();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  const isStagingEnv = isStaging();
  
  // Add rate limit headers
  const rateLimitHeaders = getRateLimitHeadersForEndpoint('/api/sandbox');
  
  return NextResponse.json({
    sandbox: true,
    environment,
    isStaging: isStagingEnv,
    isProduction: environment === 'production',
    isDevelopment: environment === 'development',
    baseUrl,
    stagingUrl: getStagingUrl(),
    productionUrl: getProductionUrl(),
    status: isStagingEnv ? 'active' : 'inactive',
    message: isStagingEnv 
      ? 'Sandbox mode is active. This environment is safe for automated testing.'
      : 'Sandbox mode is not active. This appears to be a production environment.',
    features: {
      testMode: isStagingEnv || environment === 'development',
      sandbox: isStagingEnv,
      apiKeysEnabled: true,
      analyticsEnabled: true,
      idempotencyEnabled: true,
      rateLimiting: {
        enabled: true,
        limit: isStagingEnv ? 200 : 60,
        window: '1 minute',
      },
      testData: {
        available: isStagingEnv,
        resetEnabled: isStagingEnv,
        sampleProducts: isStagingEnv,
      },
    },
    endpoints: {
      apiDocs: `${baseUrl}/api/docs`,
      openApi: `${baseUrl}/api/openapi.json`,
      graphql: `${baseUrl}/api/graphql`,
      apiKeys: `${baseUrl}/api/auth/api-keys`,
      products: `${baseUrl}/api/store/styles`,
      search: `${baseUrl}/search`,
      cart: `${baseUrl}/cart`,
      stagingInfo: `${baseUrl}/api/staging/info`,
      sandbox: `${baseUrl}/api/sandbox`,
    },
    testOperations: {
      available: isStagingEnv,
      operations: isStagingEnv ? [
        'create-test-order',
        'create-test-user',
        'reset-test-data',
        'validate-api-key',
        'test-rate-limits',
      ] : [],
    },
    documentation: {
      api: `${baseUrl}/api/docs`,
      stagingGuide: `${baseUrl}/staging-guide`,
      sandbox: `${baseUrl}/api/sandbox`,
    },
    warnings: isStagingEnv ? [] : [
      'This appears to be a production environment. Use staging environment for automated testing.',
      'Set NEXT_PUBLIC_ENVIRONMENT=staging to enable sandbox mode.',
    ],
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Environment': environment,
      'X-Is-Staging': isStagingEnv.toString(),
      'X-Sandbox-Mode': isStagingEnv.toString(),
      'X-Sandbox-Active': isStagingEnv.toString(),
      ...Object.fromEntries(rateLimitHeaders),
    },
  });
}

/**
 * POST /api/sandbox/test
 * Execute a test operation in sandbox mode
 */
export async function POST(request: Request) {
  const environment = getEnvironment();
  const isStagingEnv = isStaging();
  
  // Add rate limit headers
  const rateLimitHeaders = getRateLimitHeadersForEndpoint('/api/sandbox');
  
  // Only allow test operations in staging/development
  if (!isStagingEnv && environment !== 'development') {
    return NextResponse.json({
      error: 'Sandbox operations are only available in staging or development environments',
      environment,
      isStaging: isStagingEnv,
      message: 'This endpoint is disabled in production for safety.',
    }, {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
        'X-Environment': environment,
        'X-Is-Staging': isStagingEnv.toString(),
        'X-Sandbox-Mode': 'false',
        ...Object.fromEntries(rateLimitHeaders),
      },
    });
  }
  
  try {
    const body = await request.json();
    const { operation, parameters } = body;
    
    // Validate operation
    const allowedOperations = [
      'create-test-order',
      'create-test-user',
      'reset-test-data',
      'validate-api-key',
      'test-rate-limits',
      'ping',
    ];
    
    if (!operation || !allowedOperations.includes(operation)) {
      return NextResponse.json({
        error: 'Invalid operation',
        allowedOperations,
        received: operation,
      }, {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(rateLimitHeaders),
        },
      });
    }
    
    // Execute test operation
    let result;
    switch (operation) {
      case 'ping':
        result = {
          success: true,
          message: 'Sandbox is active and responding',
          timestamp: new Date().toISOString(),
        };
        break;
        
      case 'validate-api-key':
        result = {
          success: true,
          message: 'API key validation endpoint available',
          endpoint: '/api/auth/api-keys',
        };
        break;
        
      case 'test-rate-limits':
        result = {
          success: true,
          message: 'Rate limit headers included in response',
          rateLimit: {
            limit: isStagingEnv ? 200 : 60,
            window: '1 minute',
          },
        };
        break;
        
      case 'create-test-order':
        result = {
          success: true,
          message: 'Test order creation endpoint available',
          endpoint: '/api/services/orders',
          note: 'Use POST /api/services/orders with Idempotency-Key header for safe testing',
        };
        break;
        
      case 'create-test-user':
        result = {
          success: true,
          message: 'Test user registration endpoint available',
          endpoint: '/api/auth/register',
          note: 'Use POST /api/auth/register with Idempotency-Key header for safe testing',
        };
        break;
        
      case 'reset-test-data':
        result = {
          success: true,
          message: 'Test data reset not implemented in this demo',
          note: 'In a full implementation, this would reset test data to initial state',
        };
        break;
        
      default:
        result = {
          success: false,
          message: 'Operation not implemented',
        };
    }
    
    return NextResponse.json({
      sandbox: true,
      operation,
      parameters: parameters || {},
      result,
      environment,
      isStaging: isStagingEnv,
      timestamp: new Date().toISOString(),
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Environment': environment,
        'X-Is-Staging': isStagingEnv.toString(),
        'X-Sandbox-Mode': isStagingEnv.toString(),
        'X-Sandbox-Operation': operation,
        ...Object.fromEntries(rateLimitHeaders),
      },
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Invalid request body',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(rateLimitHeaders),
      },
    });
  }
}

