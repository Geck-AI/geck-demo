import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { hashPassword } from "@/lib/authUtils";
import { getRateLimitHeadersForEndpoint } from "@/lib/rateLimit";
import { handleIdempotentRequest, getIdempotencyKey } from "@/lib/idempotency";

const USERS_PATH = path.join(process.cwd(), "public", "data", "users.json");

interface StoredUser {
  username?: string;
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  address?: Record<string, unknown>;
  createdAt?: string;
  [key: string]: unknown;
}

function isStoredUser(value: unknown): value is StoredUser {
  return typeof value === "object" && value !== null;
}

function readUsers(): StoredUser[] {
  if (!fs.existsSync(USERS_PATH)) return [];
  const raw = fs.readFileSync(USERS_PATH, "utf-8");
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(isStoredUser);
    }
  } catch {
    // Ignore parse errors and fall through to return empty array
  }
  return [];
}

function writeUsers(users: StoredUser[]) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  password: string;
}

export async function POST(request: Request) {
  // Add rate limit headers
  const rateLimitHeaders = getRateLimitHeadersForEndpoint('/api/auth/register');
  
  // Handle idempotent request (for registration, idempotency prevents duplicate accounts)
  const idempotencyKey = getIdempotencyKey(request);
  const result = await handleIdempotentRequest(
    request,
    async () => {
      const data: UserData = await request.json();
      const { name, email, phone, street, city, state, zipcode, password } = data;
      
      // Validate required fields
      if (!name || !email || !phone || !street || !city || !state || !zipcode || !password) {
        return {
          statusCode: 400,
          response: { error: "All fields are required" },
        };
      }
      
      // Validate email format
      const emailRegex = /.+@.+\..+/;
      if (!emailRegex.test(email)) {
        return {
          statusCode: 400,
          response: { error: "Invalid email format" },
        };
      }
      
      // Validate password length
      if (password.length < 6) {
        return {
          statusCode: 400,
          response: { error: "Password must be at least 6 characters" },
        };
      }
      
      const users = readUsers();
      
      // Check if email (username) already exists
      if (
        users.some(
          (u) =>
            (typeof u.username === "string" && u.username === email) ||
            (typeof u.email === "string" && u.email === email)
        )
      ) {
        return {
          statusCode: 409,
          response: { error: "Email already exists" },
        };
      }
      
      // Hash the password before storing
      const hashedPassword = await hashPassword(password);
      
      // Create user object with all information
      const newUser = {
        username: email, // Use email as username for login
        password: hashedPassword,
        name,
        email,
        phone,
        address: {
          street,
          city,
          state,
          zipcode,
        },
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      writeUsers(users);
      
      // Auto-login: Generate token and set cookie (same as login endpoint)
      const token = "dummy-jwt-token";
      const responseData = { 
        success: true, 
        token,
        user: { name, email } 
      };

      return {
        statusCode: 200,
        response: responseData,
      };
    },
    60 * 60 // 1 hour TTL for registration idempotency
  );

  const response = NextResponse.json(result.response, {
    status: result.statusCode,
  });
  
  // Set cookie for auto-login (only if not from cache)
  if (!result.fromCache && result.statusCode === 200) {
    const token = (result.response as { token?: string }).token || "dummy-jwt-token";
    response.headers.set(
      'Set-Cookie',
      `auth-token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
        process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      }`
    );
  }
  
  // Add rate limit headers
  rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));
  
  // Add idempotency headers
  if (idempotencyKey) {
    response.headers.set('Idempotency-Key', idempotencyKey);
    response.headers.set('Idempotency-Replay', result.fromCache ? 'true' : 'false');
  }
  
  return response;
}
