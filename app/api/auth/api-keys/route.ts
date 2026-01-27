import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/api-keys
 * Generate an API key for authenticated users (partner agents)
 */
export async function POST() {
  try {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Generate a secure API key
    const apiKey = `sk_${generateSecureToken(32)}`;
    const keyId = `key_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Store API key (in production, store in database)
    // For demo purposes, we'll return it directly
    // In production, hash and store securely
    
    const keyData = {
      id: keyId,
      key: apiKey,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      scopes: ['read', 'write'], // Default scopes
    };

    return NextResponse.json({
      success: true,
      apiKey: keyData.key,
      keyId: keyData.id,
      createdAt: keyData.createdAt,
      expiresAt: keyData.expiresAt,
      scopes: keyData.scopes,
      message: 'API key generated successfully. Store this key securely - it will not be shown again.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate API key' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/api-keys
 * List API keys for authenticated user
 */
export async function GET() {
  try {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // In production, fetch from database
    // For demo, return empty list
    return NextResponse.json({
      success: true,
      keys: [],
      message: 'No API keys found. Generate one using POST /api/auth/api-keys',
    });
  } catch {
    return NextResponse.json(
      { message: 'Failed to list API keys' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/api-keys
 * Revoke an API key
 */
export async function DELETE(request: Request) {
  try {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { keyId } = await request.json();
    
    if (!keyId) {
      return NextResponse.json(
        { error: 'keyId is required' },
        { status: 400 }
      );
    }

    // In production, delete from database
    return NextResponse.json({
      success: true,
      message: 'API key revoked successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}

/**
 * Generate a secure random token
 */
function generateSecureToken(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (byte) => charset[byte % charset.length]).join('');
}

