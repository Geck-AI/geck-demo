import fs from "fs";
import path from "path";
import { verifyPassword } from "@/lib/authUtils";

interface User {
  username: string;
  password: string;
  email?: string;
}

export async function POST(request: Request) {
  const { username, password } = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    return Response.json({ error: "Username and password are required" }, { status: 400 });
  }

  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";

  // Check admin credentials from env
  if (username === expectedUser && password === expectedPass) {
    const token = "dummy-jwt-token";
    
    // Create response with cookie
    const response = Response.json({ token });
    
    // Set cookie accessible to JavaScript (for Playwright compatibility)
    response.headers.set(
      'Set-Cookie',
      `auth-token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
        process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      }`
    );
    
    return response;
  }

  // Check users.json with password verification
  const USERS_PATH = path.join(process.cwd(), "public", "data", "users.json");
  if (!fs.existsSync(USERS_PATH)) {
    return Response.json({ error: "User not found. Please register first." }, { status: 404 });
  }

  try {
    const users = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
    const user = (users as User[]).find((u) => u.username === username || u.email === username);
    
    if (!user) {
      return Response.json({ error: "User not found. Please check your username or register." }, { status: 404 });
    }
    
    if (password && await verifyPassword(password, user.password)) {
      const token = "dummy-jwt-token";
      
      // Create response with cookie
      const response = Response.json({ token });
      
      // Set cookie accessible to JavaScript (for Playwright compatibility)
      response.headers.set(
        'Set-Cookie',
        `auth-token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
          process.env.NODE_ENV === 'production' ? 'Secure;' : ''
        }`
      );
      
      return response;
    } else {
      return Response.json({ error: "Incorrect password. Please try again." }, { status: 401 });
    }
  } catch (error) {
    console.error("Login failed:", error);
    return Response.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
