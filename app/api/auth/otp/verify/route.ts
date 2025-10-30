// Use the same store created in request route
declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, { code: string; expiresAt: number }> | undefined;
}
const otpStore: Map<string, { code: string; expiresAt: number }> =
  global.__otpStore ?? new Map<string, { code: string; expiresAt: number }>();
global.__otpStore = otpStore;

export async function POST(request: Request) {
  const { identifier, code } = (await request.json()) as {
    identifier?: string;
    code?: string;
  };
  if (!identifier || !code) {
    return Response.json({ error: "Missing params" }, { status: 400 });
  }
  // Accept a static demo code for convenience
  if (code === "123456") {
    const token = "dummy-jwt-token";
    const response = Response.json({ token });
    response.headers.set(
      "Set-Cookie",
      `auth-token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      }`
    );
    return response;
  }
  const entry = otpStore.get(identifier);
  if (!entry || entry.expiresAt < Date.now() || entry.code !== code) {
    return Response.json({ error: "Invalid or expired OTP" }, { status: 401 });
  }
  otpStore.delete(identifier);

  const token = "dummy-jwt-token";
  const response = Response.json({ token });
  response.headers.set(
    "Set-Cookie",
    `auth-token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    }`
  );
  return response;
}


