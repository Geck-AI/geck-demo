import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Use the same store created in request route
declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, { code: string; expiresAt: number }> | undefined;
}
const otpStore: Map<string, { code: string; expiresAt: number }> =
  global.__otpStore ?? new Map<string, { code: string; expiresAt: number }>();
global.__otpStore = otpStore;

// Master OTP - works for any registered user
const MASTER_OTP = process.env.MASTER_OTP || "123456";

function isUserRegistered(identifier: string): boolean {
  const USERS_PATH = path.join(process.cwd(), "public", "data", "users.json");
  if (!fs.existsSync(USERS_PATH)) {
    return false;
  }

  try {
    const users = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
    const normalizedIdentifier = identifier.trim().toLowerCase();
    
    // Check if identifier matches email or phone of any user
    return users.some((u: any) => {
      const email = (u.email || "").trim().toLowerCase();
      const phone = (u.phone || "").trim();
      const username = (u.username || "").trim().toLowerCase();
      
      return email === normalizedIdentifier || 
             phone === identifier.trim() || 
             username === normalizedIdentifier;
    });
  } catch (error) {
    console.error("Error reading users.json:", error);
    return false;
  }
}

export async function POST(request: Request) {
  const { identifier, code } = (await request.json()) as {
    identifier?: string;
    code?: string;
  };
  
  if (!identifier || !code) {
    return NextResponse.json({ error: "Email/phone and OTP code are required" }, { status: 400 });
  }

  // Check for master OTP first
  if (code === MASTER_OTP) {
    // Verify user is registered before allowing master OTP
    if (!isUserRegistered(identifier.trim())) {
      return NextResponse.json({ error: "User not found. Please register first." }, { status: 404 });
    }
    
    // Master OTP accepted - proceed with login
    const token = "dummy-jwt-token";
    const response = NextResponse.json({ token });
    response.headers.set(
      "Set-Cookie",
      `auth-token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      }`
    );
    return response;
  }

  // Regular OTP verification
  const entry = otpStore.get(identifier.trim());
  if (!entry) {
    return NextResponse.json({ error: "No OTP found. Please request a new OTP." }, { status: 404 });
  }

  if (entry.expiresAt < Date.now()) {
    otpStore.delete(identifier.trim());
    return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 401 });
  }

  if (entry.code !== code) {
    return NextResponse.json({ error: "Invalid OTP code. Please try again." }, { status: 401 });
  }

  // OTP verified successfully
  otpStore.delete(identifier.trim());

  const token = "dummy-jwt-token";
  const response = NextResponse.json({ token });
  response.headers.set(
    "Set-Cookie",
    `auth-token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    }`
  );
  return response;
}


