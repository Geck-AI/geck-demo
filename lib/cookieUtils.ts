import Cookies from 'js-cookie';

// Cookie configuration constants
const COOKIE_CONFIG = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

// Token cookie name
export const AUTH_TOKEN_COOKIE = 'auth-token';

/**
 * Set a cookie with default configuration
 */
export function setCookie(name: string, value: string, options?: Cookies.CookieAttributes) {
  return Cookies.set(name, value, {
    ...COOKIE_CONFIG,
    ...options,
  });
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

/**
 * Remove a cookie
 */
export function removeCookie(name: string, options?: Cookies.CookieAttributes) {
  return Cookies.remove(name, {
    ...COOKIE_CONFIG,
    ...options,
  });
}

/**
 * Set authentication token cookie
 */
export function setAuthToken(token: string) {
  return setCookie(AUTH_TOKEN_COOKIE, token);
}

/**
 * Get authentication token from cookie
 */
export function getAuthToken(): string | undefined {
  return getCookie(AUTH_TOKEN_COOKIE);
}

/**
 * Remove authentication token cookie
 */
export function removeAuthToken() {
  return removeCookie(AUTH_TOKEN_COOKIE);
}

/**
 * Check if cookies are available (client-side only)
 */
export function areCookiesAvailable(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
