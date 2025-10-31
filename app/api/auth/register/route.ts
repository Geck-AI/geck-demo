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

interface UserData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  password: string;
}

export async function POST(request: Request) {
  const data: UserData = await request.json();
  const { name, email, phone, street, city, state, zipcode, password } = data;
  
  // Validate required fields
  if (!name || !email || !phone || !street || !city || !state || !zipcode || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  
  // Validate email format
  const emailRegex = /.+@.+\..+/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }
  
  // Validate password length
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }
  
  const users = readUsers();
  
  // Check if email (username) already exists
  if (users.some((u: any) => u.username === email || u.email === email)) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }
  
  // Hash the password before storing
  const hashedPassword = await hashPassword(password);
  
  // Create user object with all information
  const newUser = {
    username: email, // Use email as username for login
    password: hashedPassword,
    name,
    email,
    phone,
    address: {
      street,
      city,
      state,
      zipcode,
    },
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  writeUsers(users);
  
  return NextResponse.json({ success: true, user: { name, email } });
} 