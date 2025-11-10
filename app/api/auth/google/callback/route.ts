import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:3005/api/auth/google/callback";
const USERS_PATH = path.join(process.cwd(), "public", "data", "users.json");

interface GoogleJwtPayload {
  email?: string;
  name?: string;
  given_name?: string;
  picture?: string;
  sub?: string;
  id?: string;
  [key: string]: unknown;
}

interface GoogleTokenResponse {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  [key: string]: unknown;
}

interface StoredUser {
  username?: string;
  email?: string;
  password?: string;
  name?: string;
  googleId?: string;
  googlePicture?: string;
  createdAt?: string;
  lastLogin?: string;
  authProvider?: string;
  [key: string]: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStoredUser(value: unknown): value is StoredUser {
  return isRecord(value);
}

function decodeJWTPayload(token: string): GoogleJwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded = Buffer.from(padded, "base64").toString("utf-8");
    const parsed: unknown = JSON.parse(decoded);
    if (isRecord(parsed)) {
      return parsed as GoogleJwtPayload;
    }
    return null;
  } catch {
    return null;
  }
}

function readUsers(): StoredUser[] {
  if (!fs.existsSync(USERS_PATH)) return [];
  try {
    const raw = fs.readFileSync(USERS_PATH, "utf-8");
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect("/login?error=missing_code");

  // Step 2: Exchange code for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code"
    })
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect("/login?error=token_exchange_failed");
  }
  const tokenData: GoogleTokenResponse = await tokenRes.json();
  const { id_token, access_token } = tokenData;

  // Step 3: Decode ID token to get user info
  let userInfo: { email?: string; name?: string; picture?: string; sub?: string } = {};
  
  if (id_token) {
    const decoded = decodeJWTPayload(id_token);
    if (decoded) {
      userInfo = {
        email: decoded.email,
        name: decoded.name || decoded.given_name || "Google User",
        picture: decoded.picture,
        sub: decoded.sub,
      };
    }
  }

  // Fallback: Fetch user info using access token if ID token decode failed
  if (!userInfo.email && access_token) {
    try {
      const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (userRes.ok) {
        const userData: GoogleJwtPayload = await userRes.json();
        userInfo = {
          email: userData.email,
          name: userData.name || userData.given_name || "Google User",
          picture: userData.picture,
          sub: userData.id,
        };
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  }

  // Step 4: Save or update user in users.json
  if (userInfo.email) {
    const users = readUsers();
    const existingUserIndex = users.findIndex(
      (u) =>
        u.email?.toLowerCase() === userInfo.email?.toLowerCase() ||
        u.username?.toLowerCase() === userInfo.email?.toLowerCase()
    );

    if (existingUserIndex >= 0) {
      // User exists, update Google info if needed
      const existingUser = users[existingUserIndex];
      if (!existingUser.googleId) {
        users[existingUserIndex] = {
          ...existingUser,
          googleId: userInfo.sub,
          googlePicture: userInfo.picture,
          lastLogin: new Date().toISOString(),
        };
        writeUsers(users);
      } else {
        // Update last login
        users[existingUserIndex].lastLogin = new Date().toISOString();
        writeUsers(users);
      }
    } else {
      // New user from Google, create entry
      const newUser: StoredUser = {
        username: userInfo.email,
        email: userInfo.email,
        name: userInfo.name || "Google User",
        password: "", // No password for Google users
        googleId: userInfo.sub,
        googlePicture: userInfo.picture,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        authProvider: "google",
      };
      users.push(newUser);
      writeUsers(users);
    }
  }

  // Step 5: Set cookie and show popup-close script to post message and close
  const jwt = id_token || "dummy-jwt-token";
  const html = `
<html><body><script>
  if (window.opener) {
    window.opener.postMessage("google-auth-success", window.origin);
    window.close();
  } else {
    window.location.href = "/";
  }
</script>
<p style="font-family: sans-serif; text-align:center;margin-top:40px;">Login successful! You can close this window.</p>
</body></html>`;

  const res = new NextResponse(html, {
    headers: { "Content-Type": "text/html" }
  });
  res.headers.set(
    "Set-Cookie",
    `auth-token=${jwt}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`
  );
  return res;
}
