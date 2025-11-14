import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { hashPassword } from "@/lib/authUtils";

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
  const data: UserData = await request.json();
  const { name, email, phone, street, city, state, zipcode, password } = data;
  
  // Validate required fields
  if (!name || !email || !phone || !street || !city || !state || !zipcode || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  
  // Validate email format
  const emailRegex = /.+@.+\..+/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }
  
  // Validate password length
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
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
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
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
  const response = NextResponse.json({ 
    success: true, 
    token,
    user: { name, email } 
  });
  
  // Set cookie for auto-login
  response.headers.set(
    'Set-Cookie',
    `auth-token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    }`
  );
  
  return response;
} 