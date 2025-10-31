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
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || "Login failed");
    } catch {
      throw new Error("Login failed. Please try again.");
    }
  }
  const data: { token: string } = await res.json();

  // Note: Cookie is already set by the API response
  // We still call setAuthToken to ensure client-side state is updated
  setAuthToken(data.token);

  return data.token;
}

export async function requestOtp(identifier: string): Promise<{ success: boolean; message?: string }>{
  const res = await fetch("/api/auth/otp/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier }),
  });
  if (!res.ok) {
    let errorMessage = "Failed to request OTP. Please try again.";
    try {
      const errorData = await res.json();
      if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // If response is not JSON, use status-based error messages
      if (res.status === 404) {
        errorMessage = "User not found. Please register first.";
      } else if (res.status === 400) {
        errorMessage = "Invalid email or phone number.";
      }
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function verifyOtp(identifier: string, code: string): Promise<string> {
  const res = await fetch("/api/auth/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, code }),
  });
  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || "OTP verification failed");
    } catch {
      throw new Error("OTP verification failed. Please try again.");
    }
  }
  const data: { token: string } = await res.json();
  setAuthToken(data.token);
  return data.token;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  password: string;
}

export async function register(userData: RegisterData): Promise<{ success: boolean; user?: { name: string; email: string } }> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Registration failed");
  }
  
  return res.json();
}

/**
 * Logout function that clears the auth token from cookies
 */
export function logout(): void {
  // dynamic import to avoid ESM require lint issue
  import('./cookieUtils').then(({ removeAuthToken }) => removeAuthToken());
}
