"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { register } from "@/lib/authService";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Map IDs to formData keys
    const field = id.replace("register-", "");
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/.+@.+\..+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.street.trim()) newErrors.street = "Street is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipcode.trim()) newErrors.zipcode = "Zipcode is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Min 6 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        password: formData.password,
      });

      if (result.token) {
        setToken(result.token);
      }

      toast({
        title: "Registration successful!",
        description: "Welcome to our platform.",
      });

      // Track signup conversion
      if (typeof window !== 'undefined') {
        fetch('/api/analytics/conversion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversionType: 'signup',
            url: window.location.href,
            userAgent: navigator.userAgent,
          }),
        }).catch(() => { });
      }

      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-[80vh] py-12" role="main">
      <div className="flex flex-col items-center justify-center flex-grow px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Create your account</h1>
        <Card className="w-full max-w-lg p-8 shadow-lg" role="region" aria-label="Registration form">
          <div className="mb-6 flex justify-between items-center px-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === s ? "bg-stone-800 text-white" : step > s ? "bg-green-600 text-white" : "bg-stone-200 text-stone-500"
                  }`}>
                  {step > s ? "✓" : s}
                </div>
                {s < 3 && <div className={`w-12 h-1 ${step > s ? "bg-green-600" : "bg-stone-200"}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={step === 3 ? handleSubmit : handleNextStep} className="space-y-4" noValidate>
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid gap-2">
                  <label htmlFor="register-name" className="text-sm font-medium">Full Name</label>
                  <Input id="register-name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" required className={errors.name ? "border-red-500" : ""} />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="register-email" className="text-sm font-medium">Email Address</label>
                  <Input id="register-email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" required className={errors.email ? "border-red-500" : ""} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="register-phone" className="text-sm font-medium">Phone Number</label>
                  <Input id="register-phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" required className={errors.phone ? "border-red-500" : ""} />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid gap-2">
                  <label htmlFor="register-street" className="text-sm font-medium">Street Address</label>
                  <Input id="register-street" value={formData.street} onChange={handleInputChange} placeholder="123 Main St" required className={errors.street ? "border-red-500" : ""} />
                  {errors.street && <p className="text-xs text-red-500">{errors.street}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="register-city" className="text-sm font-medium">City</label>
                    <Input id="register-city" value={formData.city} onChange={handleInputChange} placeholder="New York" required className={errors.city ? "border-red-500" : ""} />
                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="register-state" className="text-sm font-medium">State</label>
                    <Input id="register-state" value={formData.state} onChange={handleInputChange} placeholder="NY" required className={errors.state ? "border-red-500" : ""} />
                    {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="register-zipcode" className="text-sm font-medium">Zipcode</label>
                  <Input id="register-zipcode" value={formData.zipcode} onChange={handleInputChange} placeholder="10001" required className={errors.zipcode ? "border-red-500" : ""} />
                  {errors.zipcode && <p className="text-xs text-red-500">{errors.zipcode}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid gap-2">
                  <label htmlFor="register-password" className="text-sm font-medium">Password</label>
                  <Input id="register-password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" required className={errors.password ? "border-red-500" : ""} />
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="register-confirmPassword" className="text-sm font-medium">Confirm Password</label>
                  <Input id="register-confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" required className={errors.confirmPassword ? "border-red-500" : ""} />
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}>
                  Back
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Please wait..." : step === 3 ? "Complete Registration" : "Next Step"}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t text-center text-sm">
            <span className="text-stone-500">Already have an account? </span>
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Log in instead
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
} 