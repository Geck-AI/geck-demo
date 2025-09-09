import fs from "fs";
import path from "path";
import { verifyPassword } from "@/lib/authUtils";

export async function POST(request: Request) {
  const { username, password } = (await request.json()) as {
    username?: string;
    password?: string;
  };

  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";

  // Check admin credentials from env
  if (username === expectedUser && password === expectedPass) {
    return Response.json({ token: "dummy-jwt-token" });
  }

  // Check users.json with password verification
  const USERS_PATH = path.join(process.cwd(), "public", "data", "users.json");
  if (fs.existsSync(USERS_PATH)) {
    try {
      const users = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
      const user = users.find((u: any) => u.username === username);
      
      if (user && password && await verifyPassword(password, user.password)) {
        return Response.json({ token: "dummy-jwt-token" });
      }
    } catch {}
  }

  return Response.json({ error: "Invalid credentials" }, { status: 401 });
}
