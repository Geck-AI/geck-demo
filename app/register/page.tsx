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
        
        // Track signup conversion by agent source
        if (typeof window !== 'undefined') {
          fetch('/api/analytics/conversion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              conversionType: 'signup',
              url: window.location.href,
              userAgent: navigator.userAgent,
            }),
          }).catch(err => {
            console.error('Failed to track conversion:', err);
          });
        }
        
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
              id="register-error"
              role="alert" 
              aria-live="assertive" 
              className="text-red-500 mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
              aria-label="Registration error"
            >
              <p className="font-medium" id="register-error-message">{error}</p>
            </div>
          )}
          {success && (
            <div 
              role="status" 
              aria-live="polite" 
              className="text-green-600 mb-4 p-3 bg-green-50 border border-green-200 rounded-md"
              aria-label="Registration success"
              aria-atomic="true"
            >
              <p className="font-medium">Registration successful! Redirecting...</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="User registration form" noValidate>
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium text-stone-700 mb-1">
                Username
              </label>
              <Input
                id="register-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-required="true"
                aria-label="Enter your username"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "register-error-message" : undefined}
                className="focus:ring-2 focus:ring-blue-500"
                data-testid="register-username-input"
              />
            </div>
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-stone-700 mb-1">
                Password
              </label>
              <Input
                id="register-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
                aria-label="Enter your password"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "register-error-message" : undefined}
                className="focus:ring-2 focus:ring-blue-500"
                data-testid="register-password-input"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Submit registration form"
              data-testid="register-submit-button"
            >
              Register
            </Button>
          </form>
          <div className="mt-4 text-center text-sm space-y-2">
            <div>
              <span>Already have an account? </span>
              <a 
                href="/login" 
                className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                aria-label="Go to login page"
              >
                Login
              </a>
            </div>
            <div>
              <span>Or use a </span>
              <a 
                href="/login?mode=otp" 
                className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                aria-label="Sign up with magic link (no password required)"
              >
                magic link
              </a>
              <span> (no password required)</span>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
} 