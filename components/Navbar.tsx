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
    <nav className="w-full" role="navigation" aria-label="Main navigation">
      <noscript>
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center text-sm text-yellow-800">
          <p>JavaScript is disabled. <Link href="/shop" className="underline">Browse our shop</Link> to see all products.</p>
        </div>
      </noscript>
      {/* Top Row: Logo, Search, Actions */}
      <div className="w-full border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-6 md:gap-8">
            {/* Logo */}
            <div className="text-2xl font-bold flex-shrink-0">
              <Link href="/" aria-label="THE STORE - Home page" data-testid="navbar-logo">
                THE STORE
              </Link>
            </div>
            
            {/* Full Width Search Bar */}
            <div className="flex-1 min-w-0" role="search" aria-label="Site search">
              <div className="hidden md:block">
                <SearchBar />
              </div>
              {/* Mobile Search Icon */}
              <Link
                href="/search"
                className="md:hidden relative text-stone-700 hover:text-stone-900"
                aria-label="Open search page"
                data-testid="mobile-search-link"
              >
                <Search 
                  className="w-5 h-5 text-stone-700 hover:text-stone-900 transition-colors duration-200" 
                  aria-hidden="true"
                />
              </Link>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center justify-end gap-4 flex-shrink-0" role="group" aria-label="User actions">
              <Link
                href="/favorites"
                className="relative text-stone-700 hover:text-stone-900"
                aria-label="View wishlist"
                data-testid="navbar-favorites-link"
              >
                <Heart 
                  className="w-5 h-5 text-stone-700 hover:text-red-600 transition-colors duration-200" 
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/cart"
                className="relative text-stone-700 hover:text-stone-900"
                aria-label={`Shopping cart${totalQty > 0 ? ` with ${totalQty} item${totalQty === 1 ? '' : 's'}` : ''}`}
                data-testid="navbar-cart-link"
              >
                <ShoppingCart 
                  className="w-5 h-5 text-stone-700 hover:text-stone-900 transition-colors duration-200" 
                  aria-hidden="true"
                />
                {totalQty > 0 && (
                  <span 
                    className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                    aria-label={`${totalQty} item${totalQty === 1 ? '' : 's'} in cart`}
                    data-testid="cart-badge"
                  >
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
                  aria-label="Logout from your account"
                  data-testid="navbar-logout-button"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
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
