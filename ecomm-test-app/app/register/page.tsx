"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 1200);
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex flex-col items-center justify-center flex-grow relative">
        <h1 className="text-2xl font-bold text-center mb-8">Register</h1>
        <Card className="w-full max-w-md p-6">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-600 mb-4">Registration successful! Redirecting...</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </div>
        </Card>
      </div>
    </div>
  );
} 