// Simple in-memory OTP store for demo purposes
declare global {
  var __otpStore: Map<string, { code: string; expiresAt: number }> | undefined;
}
const otpStore: Map<string, { code: string; expiresAt: number }> =
  global.__otpStore ?? new Map<string, { code: string; expiresAt: number }>();
global.__otpStore = otpStore;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  const { identifier } = (await request.json()) as { identifier?: string };
  if (!identifier || identifier.length < 3) {
    return Response.json({ error: "Invalid identifier" }, { status: 400 });
  }
  const code = generateCode();
  const ttlMs = 5 * 60 * 1000; // 5 minutes
  otpStore.set(identifier, { code, expiresAt: Date.now() + ttlMs });

  // In a real app, send code via SMS/Email. For demo, return codes.
  return Response.json({
    success: true,
    demoCode: code,
    staticCode: "123456",
    expiresInSec: ttlMs / 1000,
  });
}


