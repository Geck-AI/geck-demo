import { NextRequest, NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:3005/api/auth/google/callback";

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
  const tokenData = await tokenRes.json();
  const {  id_token } = tokenData;

  // Step 3: Fetch user info (optional, mostly for demo)
  // (Optional: Fetch user info using access_token here if needed for your own logic)

  // Step 4: Set cookie and show popup-close script to post message and close
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
