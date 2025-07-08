"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login or register page
    if (!token && pathname !== "/login" && pathname !== "/register") {
      router.push(`/login?next=${pathname}`);
    } else {
      setAuthorized(true);
    }
  }, [token, pathname, router]);

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
