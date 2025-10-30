import {  NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const REDIRECT_URI = "http://localhost:3005/api/auth/google/callback";

const qs = (params: Record<string, string>) =>
  Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

export async function GET() {
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    qs({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      prompt: "select_account",
      access_type: "offline"
    });
  return NextResponse.redirect(url);
}
