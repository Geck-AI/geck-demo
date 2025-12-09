import fs from "fs";
import path from "path";
import { verifyPassword } from "@/lib/authUtils";
import { getRateLimitHeadersForEndpoint } from "@/lib/rateLimit";

interface User {
  username: string;
  password: string;
  email?: string;
}

export async function POST(request: Request) {
  // Add rate limit headers
  const rateLimitHeaders = getRateLimitHeadersForEndpoint('/api/auth/login');
  
  const { username, password } = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    const response = Response.json({ error: "Username and password are required" }, { status: 400 });
    rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));
    return response;
  }

  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";

  // Check admin credentials from env
  if (username === expectedUser && password === expectedPass) {
    const token = "dummy-jwt-token";
    
    // Create response with cookie
    const response = Response.json({ token });
    
    // Set cookie accessible to JavaScript (for Playwright compatibility)
    response.headers.set(
      'Set-Cookie',
      `auth-token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
        process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      }`
    );
    
    // Add rate limit headers
    rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));
    
    return response;
  }

  // Check users.json with password verification
  const USERS_PATH = path.join(process.cwd(), "public", "data", "users.json");
  if (!fs.existsSync(USERS_PATH)) {
    const response = Response.json({ error: "User not found. Please register first." }, { status: 404 });
    rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));
    return response;
  }

  try {
    const users = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
    const user = (users as User[]).find((u) => u.username === username || u.email === username);
    
    if (!user) {
      const response = Response.json({ error: "User not found. Please check your username or register." }, { status: 404 });
      rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));
      return response;
    }
    
    if (password && await verifyPassword(password, user.password)) {
      const token = "dummy-jwt-token";
      
      // Create response with cookie
      const response = Response.json({ token });
      
      // Set cookie accessible to JavaScript (for Playwright compatibility)
      response.headers.set(
        'Set-Cookie',
        `auth-token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
          process.env.NODE_ENV === 'production' ? 'Secure;' : ''
        }`
      );
      
      // Add rate limit headers
      rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));
      
      return response;
    } else {
      const response = Response.json({ error: "Incorrect password. Please try again." }, { status: 401 });
      rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));
      return response;
    }
  } catch (error) {
    console.error("Login failed:", error);
    const response = Response.json({ error: "Login failed. Please try again." }, { status: 500 });
    rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));
    return response;
  }
}
