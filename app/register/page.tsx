"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccess(false);
    
    // Client-side validation
    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
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
        const errorMsg = data.error || "Registration failed";
        setError(errorMsg);
        // Try to map server errors to fields
        if (errorMsg.toLowerCase().includes('username') || errorMsg.toLowerCase().includes('user')) {
          setFieldErrors({ username: errorMsg });
        } else if (errorMsg.toLowerCase().includes('password')) {
          setFieldErrors({ password: errorMsg });
        }
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
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) setFieldErrors({ ...fieldErrors, username: undefined });
                }}
                required
                aria-required="true"
                aria-label="Enter your username"
                aria-invalid={!!fieldErrors.username}
                aria-describedby={fieldErrors.username ? "register-username-error" : undefined}
                className={fieldErrors.username ? "border-red-500 focus:ring-red-500" : "focus:ring-2 focus:ring-blue-500"}
                data-testid="register-username-input"
                data-agent-role="form-input"
                data-agent-action="enter-username"
                data-agent-hint="Enter your desired username for account registration"
              />
              {fieldErrors.username && (
                <p id="register-username-error" className="text-xs text-red-600 mt-1" role="alert">
                  {fieldErrors.username}
                </p>
              )}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                }}
                required
                aria-required="true"
                aria-label="Enter your password"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? "register-password-error" : undefined}
                className={fieldErrors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-2 focus:ring-blue-500"}
                data-testid="register-password-input"
                data-agent-role="form-input"
                data-agent-action="enter-password"
                data-agent-hint="Enter your password (minimum 6 characters required)"
              />
              {fieldErrors.password && (
                <p id="register-password-error" className="text-xs text-red-600 mt-1" role="alert">
                  {fieldErrors.password}
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Submit registration form"
              data-testid="register-submit-button"
              data-agent-action="submit-registration"
              data-agent-target="user-account-creation"
              data-agent-hint="Click to submit registration form and create a new account"
            >
              Register
            </Button>
          </form>
          <div className="mt-4 text-center text-sm space-y-2">
            <div>
              <span>Already have an account? </span>
              <Link 
                href="/login" 
                className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                aria-label="Go to login page"
                data-testid="register-login-link"
                data-agent-action="navigate"
                data-agent-target="login-page"
                data-agent-hint="Click to navigate to the login page if you already have an account"
              >
                Login
              </Link>
            </div>
            <div>
              <span>Or use a </span>
              <Link 
                href="/login?mode=otp" 
                className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                aria-label="Sign up with magic link (no password required)"
              >
                magic link
              </Link>
              <span> (no password required)</span>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
} 