import { useCallback } from "react";
import toast from "react-hot-toast";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

/**
 * Enhanced toast hook that uses react-hot-toast for a professional UI experience.
 * Replaces the basic alert-based implementation.
 */
export function useToast() {
  const showToast = useCallback((opts: ToastOptions) => {
    const { title, description, variant } = opts;
    const message = description ? `${title}: ${description}` : title;

    if (variant === "destructive") {
      toast.error(message);
    } else {
      toast.success(message);
    }
  }, []);

  return { toast: showToast } as const;
}
