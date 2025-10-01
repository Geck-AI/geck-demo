import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAuthToken, setAuthToken, removeAuthToken, areCookiesAvailable } from "@/lib/cookieUtils";

interface AuthState {
  token: string | null;
  isInitialized: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
  initializeFromCookies: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isInitialized: false,
      
      setToken: (token) => {
        set({ token });
        // Also store in cookies for additional persistence
        if (areCookiesAvailable()) {
          if (token) {
            setAuthToken(token);
          } else {
            removeAuthToken();
          }
        }
      },
      
      logout: () => {
        set({ token: null });
        // Clear cookies on logout
        if (areCookiesAvailable()) {
          removeAuthToken();
        }
      },
      
      initializeFromCookies: () => {
        if (areCookiesAvailable() && !get().isInitialized) {
          const cookieToken = getAuthToken();
          if (cookieToken) {
            set({ token: cookieToken, isInitialized: true });
          } else {
            set({ isInitialized: true });
          }
        }
      },
    }),
    {
      name: "auth",
      // Don't use onRehydrateStorage as it conflicts with cookie initialization
      partialize: (state) => ({ token: state.token }),
    }
  )
);