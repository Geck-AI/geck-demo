import { setAuthToken } from './cookieUtils';

/**
 * Client-side helper: sends username/password to the backend
 * and returns the JWT (or any token string your API issues).
 * Also stores the token in cookies for persistence.
 */
export async function login(
  username: string,
  password: string
): Promise<string> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  
  if (!res.ok) {
    throw new Error("Login failed");
  }
  const data: { token: string } = await res.json();

  // Note: Cookie is already set by the API response
  // We still call setAuthToken to ensure client-side state is updated
  setAuthToken(data.token);

  return data.token;
}

export async function requestOtp(identifier: string): Promise<{ demoCode?: string; staticCode?: string }>{
  const res = await fetch("/api/auth/otp/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier }),
  });
  if (!res.ok) throw new Error("Failed to request OTP");
  return res.json();
}

export async function verifyOtp(identifier: string, code: string): Promise<string> {
  const res = await fetch("/api/auth/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, code }),
  });
  if (!res.ok) throw new Error("OTP verification failed");
  const data: { token: string } = await res.json();
  setAuthToken(data.token);
  return data.token;
}

/**
 * Logout function that clears the auth token from cookies
 */
export function logout(): void {
  // dynamic import to avoid ESM require lint issue
  import('./cookieUtils').then(({ removeAuthToken }) => removeAuthToken());
}
