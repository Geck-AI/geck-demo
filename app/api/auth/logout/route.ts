export async function POST() {
  // Create response indicating successful logout
  const response = Response.json({ message: "Logged out successfully" });
  
  // Clear HTTP-only auth cookie
  response.headers.set(
    'Set-Cookie',
    `auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; ${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    }`
  );
  
  return response;
}
