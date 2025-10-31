import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Simple in-memory OTP store
declare global {
  var __otpStore: Map<string, { code: string; expiresAt: number }> | undefined;
}
const otpStore: Map<string, { code: string; expiresAt: number }> =
  global.__otpStore ?? new Map<string, { code: string; expiresAt: number }>();
global.__otpStore = otpStore;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
  try {
    const { identifier } = (await request.json()) as { identifier?: string };
    
    if (!identifier || identifier.trim().length < 3) {
      return NextResponse.json({ error: "Email or phone number is required" }, { status: 400 });
    }

    // Check if user is registered
    if (!isUserRegistered(identifier.trim())) {
      return NextResponse.json({ error: "User not found. Please register first." }, { status: 404 });
    }

    const code = generateCode();
    const ttlMs = 5 * 60 * 1000; // 5 minutes
    otpStore.set(identifier.trim(), { code, expiresAt: Date.now() + ttlMs });

    // In a real app, send code via SMS/Email
    // For now, we just store it and return success
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      expiresInSec: ttlMs / 1000,
    });
  } catch (error) {
    console.error("OTP request error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request. Please try again." },
      { status: 500 }
    );
  }
}


