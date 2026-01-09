/**
 * Environment Detection Utility
 * Determines the current environment (production, staging, development)
 */

export type Environment = 'production' | 'staging' | 'development';

/**
 * Get the current environment
 */
export function getEnvironment(): Environment {
  // Check for explicit staging environment variable
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging') {
    return 'staging';
  }

  // Check if base URL indicates staging
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  if (baseUrl.includes('staging') || baseUrl.includes('test') || baseUrl.includes('sandbox')) {
    return 'staging';
  }

  // Check NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }

  // Default to development
  return 'development';
}

/**
 * Check if current environment is staging
 */
export function isStaging(): boolean {
  return getEnvironment() === 'staging';
}

/**
 * Check if current environment is production
 */
export function isProduction(): boolean {
  return getEnvironment() === 'production';
}

/**
 * Check if current environment is development
 */
export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

/**
 * Get staging base URL
 */
export function getStagingUrl(): string {
  return process.env.NEXT_PUBLIC_STAGING_URL ||
    process.env.NEXT_PUBLIC_BASE_URL?.replace('www.', 'staging.') ||
    'https://dev.geck.ai';
}

/**
 * Get production base URL
 */
export function getProductionUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.geck.ai';
}

