"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { login, requestOtp, verifyOtp, register } from "@/lib/authService";
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
  const [isLoading, setIsLoading] = useState(false);
  const token = useAuthStore((s) => s.token);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const initializeFromCookies = useAuthStore((s) => s.initializeFromCookies);
  const setToken = useAuthStore((s) => s.setToken);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";
  const { toast } = useToast();

  // signup modal state
  const [showSignup, setShowSignup] = useState(false);
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    password: "",
    confirmedPassword: "",
  });
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  const [signupGeneralError, setSignupGeneralError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize from cookies first
    if (!isInitialized) {
      initializeFromCookies();
      return;
    }

    // If already logged in, redirect to the intended page
    if (token) {
      router.push(nextPath);
    }
  }, [token, isInitialized, nextPath, router, initializeFromCookies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const token = await login(username, password);
      setToken(token);
      router.push(nextPath);
    } catch (error) {
      // Try to extract error message from API response
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      await requestOtp(identifier);
      setOtpRequested(true);
      toast({ title: "OTP sent", description: "Please check your email or phone for the OTP code." });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const token = await verifyOtp(identifier, otp);
      setToken(token);
      router.push(nextPath);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Invalid or expired OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Real Google OAuth initiation: redirect to backend handler
  function handleGoogleLogin() {
    if (typeof window !== 'undefined') {
      const width = 500, height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 4;
      const popup = window.open(
        "/api/auth/google",
        "GoogleLogin",
        `width=${width},height=${height},left=${left},top=${top},popup=yes`
      );
      if (!popup) return;
      const popupRef = popup;

      // Avoid duplicate listeners (only one at a time)
      let finished = false;
      function handleMsg(ev: MessageEvent) {
        if (ev.origin !== window.location.origin) return;
        if (ev.data === "google-auth-success" && !finished) {
          finished = true;
          window.removeEventListener("message", handleMsg);
          popupRef.close?.();
          // Rely on cookie/session login, reload or route
          window.location.href = "/";
        }
      }
      window.addEventListener("message", handleMsg);
    }
  }

  // Show loading while initializing
  if (!isInitialized) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Don't show login form if already logged in
  if (token) {
    return <div className="flex justify-center items-center h-screen">Redirecting...</div>;
  }

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex flex-col items-center justify-center flex-grow relative">
        <h1 className="text-2xl font-bold text-center mb-8">
          Log into your account
        </h1>
        <Card className="w-full max-w-md p-6">
          {/* Toggle action – prefer a single button for OTP entry */}
          {mode === "password" ? (
            <div className="flex justify-end mb-2">
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setMode("otp")}
                disabled={isLoading}
              >
                Login with OTP
              </button>
            </div>
          ) : (
            <div className="flex justify-end mb-2">
              <button
                className="text-sm text-stone-700 hover:underline"
                onClick={() => setMode("password")}
                disabled={isLoading}
              >
                Back to password login
              </button>
            </div>
          )}
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          {mode === "password" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Email or phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading || otpRequested}
              />
              {!otpRequested ? (
                <Button className="w-full" onClick={handleRequestOtp} disabled={isLoading || !identifier}>
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              ) : (
                <>
                  <div className="text-xs text-stone-600 mb-2">
                    Enter the OTP code sent to your email or phone.
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button className="w-full" onClick={handleVerifyOtp} disabled={isLoading || otp.length < 4}>
                    {isLoading ? "Verifying..." : "Verify & Login"}
                  </Button>
                  <button
                    className="text-sm text-blue-600 hover:underline mt-2"
                    onClick={() => {
                      setOtpRequested(false);
                      setOtp("");
                      setErrorMessage("");
                    }}
                    disabled={isLoading}
                  >
                    Request new OTP
                  </button>
                </>
              )}
            </div>
          )}

          {/* Google login divider */}
          <div className="flex items-center my-6">
            <span className="flex-1 h-px bg-stone-200" />
            <span className="mx-3 text-xs text-stone-500">or</span>
            <span className="flex-1 h-px bg-stone-200" />
          </div>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center mb-2"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {/* Ideally, use a Google icon */}
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.02 1.52 7.42 2.8l5.48-5.43C33.17 3.54 28.83 1.5 24 1.5 14.82 1.5 6.94 6.81 2.82 14.16l6.65 5.17C11.45 14.02 17.19 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.73 24.55c0-1.81-.16-3.54-.47-5.18H24v9.8h12.83c-.55 2.9-2.23 5.36-4.74 7.07l7.25 5.65C43.6 37.24 46.73 31.48 46.73 24.55z"/>
                <path fill="#FBBC05" d="M9.47 28.28A15.9 15.9 0 018 24c0-1.49.23-2.94.64-4.28l-6.65-5.17A23.972 23.972 0 000 24c0 3.89.93 7.57 2.56 10.83l7.1-5.55c-.04-.43-.09-.86-.09-1.34z"/>
                <path fill="#EA4335" d="M24 46.5c6.48 0 11.91-2.14 15.87-5.83l-7.25-5.65c-2 1.36-4.53 2.17-8.62 2.17-6.81 0-12.55-4.52-14.68-10.57l-7.1 5.55C6.94 41.19 14.82 46.5 24 46.5z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
            Login with Google
          </Button>
        </Card>
        <div className="mt-4 text-center text-sm">
          New here? {" "}
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowSignup(true);
              setSignupStep(1);
              setSignupErrors({});
              setSignupSuccess(null);
              setSignupGeneralError(null);
              // Reset form data
              setSignup({
                name: "",
                email: "",
                phone: "",
                street: "",
                city: "",
                state: "",
                zipcode: "",
                password: "",
                confirmedPassword: "",
              });
            }}
            className="text-blue-600 hover:underline"
          >
            Create an account
          </button>
        </div>

        {showSignup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => {
                setShowSignup(false);
                setSignupGeneralError(null);
                setSignupErrors({});
                setSignupSuccess(null);
              }}
            />
            <div className="relative bg-white rounded-md shadow-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Create your account</h2>
                <button
                  className="text-stone-600 hover:text-stone-900"
                  onClick={() => {
                    setShowSignup(false);
                    setSignupGeneralError(null);
                    setSignupErrors({});
                    setSignupSuccess(null);
                  }}
                >
                  ✕
                </button>
              </div>
              <div className="mb-3 text-sm text-stone-600">Step {signupStep} of 3</div>
              
              {/* General Error Message */}
              {signupGeneralError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{signupGeneralError}</p>
                </div>
              )}
              
              {/* Success Message */}
              {signupSuccess ? (
                <div className="text-green-600 font-semibold text-center my-8 min-h-[100px] flex items-center justify-center">
                  {signupSuccess}
                </div>
              ) : signupStep === 1 ? (
                <div className="grid gap-3">
                  <div>
                    <label htmlFor="signup-name" className="block text-sm mb-1">Name</label>
                    <Input
                      id="signup-name"
                      value={signup.name}
                      onChange={(e) => setSignup((p) => ({ ...p, name: e.target.value }))}
                      className={signupErrors.name ? "border-red-500" : ""}
                    />
                    {signupErrors.name && (
                      <p className="text-xs text-red-600 mt-1">{signupErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="signup-email" className="block text-sm mb-1">Email</label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signup.email}
                      onChange={(e) => setSignup((p) => ({ ...p, email: e.target.value }))}
                      className={signupErrors.email ? "border-red-500" : ""}
                    />
                    {signupErrors.email && (
                      <p className="text-xs text-red-600 mt-1">{signupErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="signup-phone" className="block text-sm mb-1">Phone</label>
                    <Input
                      id="signup-phone"
                      value={signup.phone}
                      onChange={(e) => setSignup((p) => ({ ...p, phone: e.target.value }))}
                      className={signupErrors.phone ? "border-red-500" : ""}
                    />
                    {signupErrors.phone && (
                      <p className="text-xs text-red-600 mt-1">{signupErrors.phone}</p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      onClick={() => {
                        const errs: Record<string, string> = {};
                        if (!signup.name.trim()) errs.name = "Name is required";
                        const emailOk = /.+@.+\..+/.test(signup.email);
                        if (!signup.email.trim()) errs.email = "Email is required";
                        else if (!emailOk) errs.email = "Enter a valid email";
                        const phoneOk = /^[0-9+()\-\s]{7,}$/.test(signup.phone);
                        if (!signup.phone.trim()) errs.phone = "Phone is required";
                        else if (!phoneOk) errs.phone = "Enter a valid phone number";
                        setSignupErrors(errs);
                        setSignupGeneralError(null);
                        if (Object.keys(errs).length === 0) setSignupStep(2);
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              ) : signupStep === 2 ? (
                <div className="grid gap-3">
                  <div>
                    <label htmlFor="signup-street" className="block text-sm mb-1">Street Address</label>
                    <Input
                      id="signup-street"
                      value={signup.street}
                      onChange={(e) => setSignup((p) => ({ ...p, street: e.target.value }))}
                      className={signupErrors.street ? "border-red-500" : ""}
                    />
                    {signupErrors.street && (
                      <p className="text-xs text-red-600 mt-1">{signupErrors.street}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="signup-city" className="block text-sm mb-1">City</label>
                      <Input
                        id="signup-city"
                        value={signup.city}
                        onChange={(e) => setSignup((p) => ({ ...p, city: e.target.value }))}
                        className={signupErrors.city ? "border-red-500" : ""}
                      />
                      {signupErrors.city && (
                        <p className="text-xs text-red-600 mt-1">{signupErrors.city}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="signup-state" className="block text-sm mb-1">State</label>
                      <Input
                        id="signup-state"
                        value={signup.state}
                        onChange={(e) => setSignup((p) => ({ ...p, state: e.target.value }))}
                        className={signupErrors.state ? "border-red-500" : ""}
                      />
                      {signupErrors.state && (
                        <p className="text-xs text-red-600 mt-1">{signupErrors.state}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="signup-zipcode" className="block text-sm mb-1">Zipcode</label>
                    <Input
                      id="signup-zipcode"
                      value={signup.zipcode}
                      onChange={(e) => setSignup((p) => ({ ...p, zipcode: e.target.value }))}
                      className={signupErrors.zipcode ? "border-red-500" : ""}
                    />
                    {signupErrors.zipcode && (
                      <p className="text-xs text-red-600 mt-1">{signupErrors.zipcode}</p>
                    )}
                  </div>
                  <div className="flex justify-between gap-2 mt-2">
                    <Button variant="secondary" onClick={() => {
                      setSignupStep(1);
                      setSignupGeneralError(null);
                    }}>
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        const errs: Record<string, string> = {};
                        if (!signup.street.trim()) errs.street = "Street is required";
                        if (!signup.city.trim()) errs.city = "City is required";
                        if (!signup.state.trim()) errs.state = "State is required";
                        const zipOk = /^[A-Za-z0-9\-\s]{3,10}$/.test(signup.zipcode);
                        if (!signup.zipcode.trim()) errs.zipcode = "Zipcode is required";
                        else if (!zipOk) errs.zipcode = "Enter a valid code";
                        setSignupErrors(errs);
                        setSignupGeneralError(null);
                        if (Object.keys(errs).length === 0) setSignupStep(3);
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3">
                  <div>
                    <label htmlFor="signup-password" className="block text-sm mb-1">Password</label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signup.password}
                      onChange={(e) => setSignup((p) => ({ ...p, password: e.target.value }))}
                      className={signupErrors.password ? "border-red-500" : ""}
                    />
                    {signupErrors.password && (
                      <p className="text-xs text-red-600 mt-1">{signupErrors.password}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="signup-confirm-password" className="block text-sm mb-1">Confirm Password</label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      value={signup.confirmedPassword}
                      onChange={(e) => setSignup((p) => ({ ...p, confirmedPassword: e.target.value }))}
                      className={signupErrors.confirmedPassword ? "border-red-500" : ""}
                    />
                    {signupErrors.confirmedPassword && (
                      <p className="text-xs text-red-600 mt-1">{signupErrors.confirmedPassword}</p>
                    )}
                  </div>
                  <div className="flex justify-between gap-2 mt-2">
                    <Button variant="secondary" onClick={() => {
                      setSignupStep(2);
                      setSignupGeneralError(null);
                    }}>
                      Back
                    </Button>
                    <Button
                      onClick={async () => {
                        const errs: Record<string, string> = {};
                        if (!signup.password.trim()) errs.password = "Password is required";
                        else if (signup.password.length < 6) errs.password = "Password must be at least 6 characters";
                        if (!signup.confirmedPassword.trim()) errs.confirmedPassword = "Please confirm your password";
                        else if (signup.password !== signup.confirmedPassword) errs.confirmedPassword = "Passwords do not match";
                        setSignupErrors(errs);
                        setSignupGeneralError(null);
                        if (Object.keys(errs).length === 0) {
                          setIsLoading(true);
                          setSignupGeneralError(null);
                          setSignupErrors({});
                          try {
                            // Register the user
                            const result = await register({
                              name: signup.name,
                              email: signup.email,
                              phone: signup.phone,
                              street: signup.street,
                              city: signup.city,
                              state: signup.state,
                              zipcode: signup.zipcode,
                              password: signup.password,
                            });
                            
                            // Auto-login: Set token in auth store if received
                            if (result.token) {
                              setToken(result.token);
                            }
                            
                            // Show success message inside popup
                            setSignupSuccess(`Account created successfully! Welcome ${signup.name}!`);
                            
                            // Redirect to home page after a brief delay
                            setTimeout(() => {
                              router.push(`/?registered=true&name=${encodeURIComponent(signup.name)}`);
                            }, 1500);
                          } catch (error) {
                            const errorMessage = error instanceof Error ? error.message : "Registration failed";
                            if (errorMessage.includes("already exists") || errorMessage.includes("email")) {
                              // Redirect to step 1 to fix email
                              setSignupStep(1);
                              setSignupErrors({ email: "This email is already registered" });
                              setSignupGeneralError("This email is already registered. Please use a different email.");
                            } else {
                              setSignupGeneralError(errorMessage);
                              setSignupErrors({ password: errorMessage });
                            }
                          } finally {
                            setIsLoading(false);
                          }
                        }
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
