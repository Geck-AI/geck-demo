"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Heart, LogOut, Search } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import CategorySubheader from "@/components/CategorySubheader";

export default function Navbar() {
  const pathname = usePathname();
  const totalQty = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.quantity, 0)
  );
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side cookies
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear client-side state
      logout();
      window.location.href = "/login";
    }
  };

  return (
    <nav className="w-full">
      {/* Top Row: Logo, Search, Actions */}
      <div className="w-full border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-6 md:gap-8">
            {/* Logo */}
            <div className="text-2xl font-bold flex-shrink-0">
              <Link href="/">THE STORE</Link>
            </div>
            
            {/* Full Width Search Bar */}
            <div className="flex-1 min-w-0">
              <div className="hidden md:block">
                <SearchBar />
              </div>
              {/* Mobile Search Icon */}
              <Link
                href="/search"
                className="md:hidden relative text-stone-700 hover:text-stone-900"
              >
                <Search className="w-5 h-5 text-stone-700 hover:text-stone-900 transition-colors duration-200" />
              </Link>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center justify-end gap-4 flex-shrink-0">
              <Link
                href="/favorites"
                className="relative text-stone-700 hover:text-stone-900"
                aria-label="wishlist"
              >
                <Heart className="w-5 h-5 text-stone-700 hover:text-red-600 transition-colors duration-200" />
              </Link>
              <Link
                href="/cart"
                className="relative text-stone-700 hover:text-stone-900"
                aria-label="shopping cart"
              >
                <ShoppingCart className="w-5 h-5 text-stone-700 hover:text-stone-900 transition-colors duration-200" />
                {totalQty > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                    {totalQty}
                  </span>
                )}
              </Link>
              {token && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Subheader - Only on Home Page */}
      {pathname === "/" && <CategorySubheader />}
    </nav>
  );
}
