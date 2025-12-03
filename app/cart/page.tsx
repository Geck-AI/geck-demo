"use client";

import React from "react";
import CartView from "@/components/CartView";

export default function CartPage() {
  return (
    <main className="min-h-screen p-8 bg-white" role="main" aria-label="Shopping cart page">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <CartView />
    </main>
  );
}