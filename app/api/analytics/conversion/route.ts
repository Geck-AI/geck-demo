import { NextRequest, NextResponse } from 'next/server';
import { detectAgent } from '@/lib/agentDetection';
import { getRateLimitHeadersForEndpoint } from '@/lib/rateLimit';
import fs from 'fs';
import path from 'path';

interface Conversion {
  timestamp: string;
  agentName: string;
  agentType: string;
  userAgent: string;
  conversionType: 'purchase' | 'signup' | 'add_to_cart' | 'view_product' | 'other';
  value?: number;
  orderId?: string;
  productId?: string;
  url: string;
  ip?: string;
}

const CONVERSIONS_FILE = path.join(process.cwd(), 'data', 'conversions.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read conversions from file
function readConversions(): Conversion[] {
  ensureDataDirectory();
  if (!fs.existsSync(CONVERSIONS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(CONVERSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading conversions file:', error);
    return [];
  }
}

// Write conversions to file
function writeConversions(conversions: Conversion[]) {
  ensureDataDirectory();
  // Keep only last 5,000 conversions
  const recentConversions = conversions.slice(-5000);
  fs.writeFileSync(CONVERSIONS_FILE, JSON.stringify(recentConversions, null, 2));
}

export async function POST(request: NextRequest) {
  // Add rate limit headers
  const rateLimitHeaders = getRateLimitHeadersForEndpoint('/api/analytics/conversion');
  
  try {
    const body = await request.json();
    const { conversionType, value, orderId, productId, url, userAgent, ip } = body;

    if (!conversionType || !url) {
      const response = NextResponse.json(
        { error: 'Missing required fields: conversionType and url are required' },
        { status: 400 }
      );
      rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));
      return response;
    }

    const agent = detectAgent(userAgent || request.headers.get('user-agent') || '');

    const conversion: Conversion = {
      timestamp: new Date().toISOString(),
      agentName: agent.name,
      agentType: agent.type,
      userAgent: userAgent || request.headers.get('user-agent') || '',
      conversionType,
      value: value || undefined,
      orderId: orderId || undefined,
      productId: productId || undefined,
      url,
      ip: ip || request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || undefined,
    };

    // Read existing conversions
    const conversions = readConversions();
    
    // Add new conversion
    conversions.push(conversion);
    
    // Write back to file
    writeConversions(conversions);

    const response = NextResponse.json({
      success: true,
      message: 'Conversion tracked',
      conversion: {
        type: conversionType,
        agent: agent.name,
        agentType: agent.type,
      },
    }, { status: 201 });
    
    // Add rate limit headers
    rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));
    
    return response;

  } catch (error) {
    console.error('Error processing conversion:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));
    return response;
  }
}

export async function GET(request: NextRequest) {
  // Add rate limit headers
  const rateLimitHeaders = getRateLimitHeadersForEndpoint('/api/analytics/conversion');
  
  try {
    const conversions = readConversions();
    const searchParams = request.nextUrl.searchParams;
    const agentName = searchParams.get('agent');
    const agentType = searchParams.get('type');
    const conversionType = searchParams.get('conversionType');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    let filteredConversions = conversions;

    // Filter by agent name
    if (agentName) {
      filteredConversions = filteredConversions.filter(c => c.agentName === agentName);
    }

    // Filter by agent type
    if (agentType) {
      filteredConversions = filteredConversions.filter(c => c.agentType === agentType);
    }

    // Filter by conversion type
    if (conversionType) {
      filteredConversions = filteredConversions.filter(c => c.conversionType === conversionType);
    }

    // Get statistics
    const stats = {
      total: conversions.length,
      filtered: filteredConversions.length,
      byAgent: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      byConversionType: {} as Record<string, number>,
      totalValue: conversions.reduce((sum, c) => sum + (c.value || 0), 0),
      recent: filteredConversions.slice(-limit),
    };

    // Count by agent
    conversions.forEach(conv => {
      stats.byAgent[conv.agentName] = (stats.byAgent[conv.agentName] || 0) + 1;
    });

    // Count by type
    conversions.forEach(conv => {
      stats.byType[conv.agentType] = (stats.byType[conv.agentType] || 0) + 1;
    });

    // Count by conversion type
    conversions.forEach(conv => {
      stats.byConversionType[conv.conversionType] = (stats.byConversionType[conv.conversionType] || 0) + 1;
    });

    const response = NextResponse.json(stats);
    rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));
    return response;
  } catch (error) {
    console.error('Error reading conversions:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));
    return response;
  }
}

