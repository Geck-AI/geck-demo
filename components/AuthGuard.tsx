"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

interface AuthGuardProps {
  children: ReactNode;
  /**
   * List of paths that require authentication
   * If pathname matches any of these, user must be logged in
   */
  protectedPaths?: string[];
}

// Default protected paths that require authentication
// Only pages that truly need user authentication should be listed here
const DEFAULT_PROTECTED_PATHS = [
  '/account',
  '/api-keys',
  // Note: Cart and favorites are public - users can view without login
  // Checkout will prompt for login when needed
];

export default function AuthGuard({ children, protectedPaths = DEFAULT_PROTECTED_PATHS }: AuthGuardProps) {
  const token = useAuthStore((s) => s.token);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const initializeFromCookies = useAuthStore((s) => s.initializeFromCookies);
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Initialize from cookies first
    if (!isInitialized) {
      initializeFromCookies();
      return;
    }

    // Check if current path requires authentication
    const requiresAuth = protectedPaths.some(path => 
      pathname === path || pathname.startsWith(path + '/')
    );

    // Public pages (login, register, and all other pages) don't require auth
    const isPublicPage = pathname === "/login" || 
                        pathname === "/register" || 
                        pathname.startsWith("/api/") ||
                        !requiresAuth;

    // Only redirect to login if page requires auth and user is not authenticated
    if (requiresAuth && !token && !isPublicPage) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    // Allow access to public pages or authenticated users
    setAuthorized(true);
  }, [token, isInitialized, pathname, router, initializeFromCookies, protectedPaths]);

  // Show loading state only during initialization
  if (!isInitialized) {
    return null;
  }

  // For protected pages, wait for authorization check
  const requiresAuth = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  if (requiresAuth && !authorized) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}
