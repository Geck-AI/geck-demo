"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { login, requestOtp, verifyOtp } from "@/lib/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string; identifier?: string; otp?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const token = useAuthStore((s) => s.token);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const initializeFromCookies = useAuthStore((s) => s.initializeFromCookies);
  const setToken = useAuthStore((s) => s.setToken);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";
  const { toast } = useToast();

  useEffect(() => {
    if (!isInitialized) {
      initializeFromCookies();
      return;
    }
    if (token) {
      router.push(nextPath);
    }
  }, [token, isInitialized, nextPath, router, initializeFromCookies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setFieldErrors({});

    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) errors.username = "Username is required";
    if (!password.trim()) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const token = await login(username, password);
      setToken(token);
      router.push(nextPath);
    } catch (error) {
      if (error instanceof Error) {
        const errorMsg = error.message;
        setErrorMessage(errorMsg);
        if (errorMsg.toLowerCase().includes('username') || errorMsg.toLowerCase().includes('user')) {
          setFieldErrors({ username: errorMsg });
        } else if (errorMsg.toLowerCase().includes('password')) {
          setFieldErrors({ password: errorMsg });
        }
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setFieldErrors({});

    if (!identifier.trim()) {
      setFieldErrors({ identifier: "Email or phone is required" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await requestOtp(identifier);
      setOtpRequested(true);
      const description = response.code
        ? `Please check your email or phone. Demo OTP: ${response.code}`
        : "Please check your email or phone.";
      toast({ title: "OTP sent", description });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to send OTP";
      setErrorMessage(msg);
      setFieldErrors({ identifier: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setFieldErrors({});
    setIsLoading(true);
    setErrorMessage("");

    if (!otp.trim()) {
      setFieldErrors({ otp: "OTP code is required" });
      setIsLoading(false);
      return;
    }

    try {
      const token = await verifyOtp(identifier, otp);
      setToken(token);
      router.push(nextPath);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Invalid OTP";
      setErrorMessage(msg);
      setFieldErrors({ otp: msg });
    } finally {
      setIsLoading(false);
    }
  };

  function handleGoogleLogin() {
    if (typeof window !== 'undefined') {
      const width = 500, height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 4;
      const popup = window.open("/api/auth/google", "GoogleLogin", `width=${width},height=${height},left=${left},top=${top},popup=yes`);
      if (!popup) return;

      const handleMsg = (ev: MessageEvent) => {
        if (ev.origin !== window.location.origin) return;
        if (ev.data === "google-auth-success") {
          window.removeEventListener("message", handleMsg);
          popup.close();
          window.location.href = "/";
        }
      };
      window.addEventListener("message", handleMsg);
    }
  }

  if (!isInitialized || token) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-[80vh] py-12" role="main">
      <div className="flex flex-col items-center justify-center flex-grow px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Log into your account</h1>
        <Card className="w-full max-w-md p-8 shadow-lg">
          <div className="flex justify-end mb-6">
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => {
                setMode(mode === "password" ? "otp" : "password");
                setErrorMessage("");
                setFieldErrors({});
              }}
              disabled={isLoading}
            >
              {mode === "password" ? "Login with OTP" : "Back to password login"}
            </button>
          </div>

          {errorMessage && (
            <div className="text-red-500 mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-sm">
              {errorMessage}
            </div>
          )}

          {mode === "password" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username or Email</label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                  className={fieldErrors.username ? "border-red-500" : ""}
                />
                {fieldErrors.username && <p className="text-xs text-red-500">{fieldErrors.username}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className={fieldErrors.password ? "border-red-500" : ""}
                />
                {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="identifier" className="text-sm font-medium">Email or Phone</label>
                <Input
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading || otpRequested}
                  className={fieldErrors.identifier ? "border-red-500" : ""}
                />
                {fieldErrors.identifier && <p className="text-xs text-red-500">{fieldErrors.identifier}</p>}
              </div>

              {!otpRequested ? (
                <Button className="w-full" onClick={handleRequestOtp} disabled={isLoading || !identifier}>
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="otp" className="text-sm font-medium">OTP Code</label>
                    <Input
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={isLoading}
                      placeholder="Enter 4-digit code"
                      className={fieldErrors.otp ? "border-red-500" : ""}
                    />
                    {fieldErrors.otp && <p className="text-xs text-red-500">{fieldErrors.otp}</p>}
                  </div>
                  <Button className="w-full" onClick={handleVerifyOtp} disabled={isLoading || otp.length < 4}>
                    {isLoading ? "Verifying..." : "Verify & Login"}
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="mx-4 text-xs text-stone-400 font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
            <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.02 1.52 7.42 2.8l5.48-5.43C33.17 3.54 28.83 1.5 24 1.5 14.82 1.5 6.94 6.81 2.82 14.16l6.65 5.17C11.45 14.02 17.19 9.5 24 9.5z" />
              <path fill="#34A853" d="M46.73 24.55c0-1.81-.16-3.54-.47-5.18H24v9.8h12.83c-.55 2.9-2.23 5.36-4.74 7.07l7.25 5.65C43.6 37.24 46.73 31.48 46.73 24.55z" />
              <path fill="#FBBC05" d="M9.47 28.28A15.9 15.9 0 018 24c0-1.49.23-2.94.64-4.28l-6.65-5.17A23.972 23.972 0 000 24c0 3.89.93 7.57 2.56 10.83l7.1-5.55c-.04-.43-.09-.86-.09-1.34z" />
              <path fill="#EA4335" d="M24 46.5c6.48 0 11.91-2.14 15.87-5.83l-7.25-5.65c-2 1.36-4.53 2.17-8.62 2.17-6.81 0-12.55-4.52-14.68-10.57l-7.1 5.55C6.94 41.19 14.82 46.5 24 46.5z" />
            </svg>
            Continue with Google
          </Button>
        </Card>

        <div className="mt-8 text-center text-sm space-y-3">
          <p>
            <span className="text-stone-500">Don't have an account? </span>
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">
              Create one now
            </Link>
          </p>
          <Link href="/login?mode=otp" className="text-stone-500 hover:text-stone-800 transition-colors">
            Forgot password? Use magic link
          </Link>
        </div>
      </div>
    </main>
  );
}
