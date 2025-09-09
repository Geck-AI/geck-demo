import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { hashPassword } from "@/lib/authUtils";

const USERS_PATH = path.join(process.cwd(), "public", "data", "users.json");

function readUsers() {
  if (!fs.existsSync(USERS_PATH)) return [];
  const raw = fs.readFileSync(USERS_PATH, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeUsers(users: any[]) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }
  
  const users = readUsers();
  if (users.some((u: any) => u.username === username)) {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  }
  
  // Hash the password before storing
  const hashedPassword = await hashPassword(password);
  users.push({ username, password: hashedPassword });
  writeUsers(users);
  
  return NextResponse.json({ success: true });
} 