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
    <main className="flex flex-col h-[60vh]" role="main" aria-label="Registration page">
      <div className="flex flex-col items-center justify-center flex-grow relative">
        <h1 className="text-2xl font-bold text-center mb-8">Register</h1>
        <Card className="w-full max-w-md p-6" role="region" aria-label="Registration form">
          {error && (
            <div 
              role="alert" 
              aria-live="assertive" 
              className="text-red-500 mb-4"
              aria-label="Registration error"
            >
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div 
              role="status" 
              aria-live="polite" 
              className="text-green-600 mb-4"
              aria-label="Registration success"
            >
              <p>Registration successful! Redirecting...</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="User registration form">
            <div>
              <label htmlFor="register-username" className="sr-only">Username</label>
              <Input
                id="register-username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-required="true"
                aria-label="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="register-password" className="sr-only">Password</label>
              <Input
                id="register-password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
                aria-label="Enter your password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              aria-label="Submit registration form"
            >
              Register
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span>Already have an account? </span>
            <a 
              href="/login" 
              className="text-blue-600 hover:underline"
              aria-label="Go to login page"
            >
              Login
            </a>
          </div>
        </Card>
      </div>
    </main>
  );
} 