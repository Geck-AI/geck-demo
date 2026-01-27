"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cartStore";
import { useAppStore } from "@/stores/useAppStore";
import { checkoutOrder } from "@/lib/orderService";
import { fetchStyleById } from "@/lib/styleService";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";
import { ArrowLeft } from "lucide-react";

interface ItemData {
  id: number;
  productDisplayName: string;
  priceUSD?: number;
  imageURL: string;
}

export default function CheckoutPage() {
  const { toast } = useToast();
  const router = useRouter();
  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const addOrder = useAppStore((s) => s.addOrder);

  const [productData, setProductData] = useState<Record<number, ItemData>>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [address, setAddress] = useState<{
    name: string;
    email: string;
    streetAddress: string;
    country: string;
    city: string;
    state: string;
    zipcode: string;
    [key: string]: string;
  }>({
    name: "",
    email: "",
    streetAddress: "",
    country: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof address, boolean>>
  >({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !loading) {
      router.push("/cart");
    }
  }, [cartItems.length, loading, router]);

  // Fetch product data
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const pairs = await Promise.all(
          cartItems.map(async ({ id }) => {
            const data = await fetchStyleById(id);
            return [id, data] as const;
          })
        );
        setProductData(Object.fromEntries(pairs) as Record<number, ItemData>);
      } finally {
        setLoading(false);
      }
    };

    if (cartItems.length) fetchAll();
    else setLoading(false);
  }, [cartItems]);

  const total = cartItems.reduce(
    (sum, it) => sum + (productData[it.id]?.priceUSD || 0) * it.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      router.push("/cart");
      return;
    }

    // Validate form
    const newErrors: Partial<Record<keyof typeof address, boolean>> = {};
    (Object.keys(address) as (keyof typeof address)[]).forEach((k) => {
      if (!address[k].trim()) newErrors[k] = true;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    const itemsForOrder = cartItems.map(({ id, quantity }) => ({
      id,
      quantity,
      productDisplayName: productData[id]?.productDisplayName || "Unknown",
      imageURL: productData[id]?.imageURL || "",
      priceUSD: productData[id]?.priceUSD || 0,
    }));

    try {
      const res = await checkoutOrder({
        ...address,
        items: itemsForOrder,
        totalAmount: total,
        timestamp: Date.now(),
      });

      if (res.status === "success") {
        // Save the order locally, including shipping details
        addOrder({
          orderId: res.orderId,
          items: itemsForOrder,
          totalAmount: total,
          timestamp: Date.now(),
          name: address.name,
          streetAddress: address.streetAddress,
          city: address.city,
          state: address.state,
          zipcode: address.zipcode,
        });

        // Track conversion by agent source
        if (typeof window !== 'undefined') {
          fetch('/api/analytics/conversion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              conversionType: 'purchase',
              value: total,
              orderId: res.orderId,
              url: window.location.href,
              userAgent: navigator.userAgent,
            }),
          }).catch(err => {
            // Silently fail - don't block checkout
            console.error('Failed to track conversion:', err);
          });
        }

        // Clear the cart
        clearCart();

        // Navigate to success page
        router.push(
          `/order-success?orderId=${
            res.orderId
          }&arrivalDate=${encodeURIComponent(res.arrivalDate ?? "")}`
        );
      }
    } catch (e) {
      console.error("Checkout failed", e);
      toast({
        title: "Checkout failed",
        description: "Something went wrong while processing your order.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const countryOptions = [
    "United States",
    "Canada",
    "United Kingdom",
    "India",
    "Australia",
  ];

  const citiesByCountry: Record<string, string[]> = {
    "United States": ["New York", "San Francisco", "Los Angeles", "Chicago"],
    Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],
    "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds"],
    India: ["Mumbai", "Delhi", "Bengaluru", "Chennai"],
    Australia: ["Sydney", "Melbourne", "Brisbane", "Perth"],
  };

  const fields = [
    {
      label: "Name",
      name: "name",
      placeholder: "First and last name",
    },
    {
      label: "Email",
      name: "email",
      placeholder: "email@example.com",
    },
    {
      label: "Street Address",
      name: "streetAddress",
      placeholder: "100, Main St",
    },
    {
      label: "Country",
      name: "country",
      placeholder: "Country",
    },
    {
      label: "City",
      name: "city",
      placeholder: "City",
    },
    {
      label: "State",
      name: "state",
      placeholder: "State",
    },
    {
      label: "Zipcode",
      name: "zipcode",
      placeholder: "Zip / Postal code",
    },
  ];

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-white" role="main" aria-label="Checkout page">
        <div className="max-w-4xl mx-auto">
          <div className="p-4" role="status" aria-live="polite" aria-busy="true">
            <div className="flex items-center gap-2">
              <div 
                className="animate-spin rounded-full h-5 w-5 border-b-2 border-stone-800"
                aria-hidden="true"
              ></div>
              <p>Loading checkout details...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen p-8 bg-white" role="main" aria-label="Checkout page">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-stone-600 mb-4">Your cart is empty.</p>
            <Link
              href="/cart"
              className="inline-block bg-black text-white px-6 py-3 rounded-sm hover:bg-stone-800 transition-colors"
            >
              Return to Cart
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-white" role="main" aria-label="Checkout page">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-6"
          aria-label="Return to cart"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Cart
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Summary */}
          <section className="flex-1 lg:w-2/3" aria-labelledby="order-summary-heading">
            <h2 id="order-summary-heading" className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-stone-50 rounded-sm p-4 space-y-4">
              {cartItems.map(({ id, quantity }) => {
                const product = productData[id];
                if (!product) return null;
                const unitPrice = product.priceUSD ?? 0;
                const itemTotal = unitPrice * quantity;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-4"
                    role="listitem"
                  >
                    <img
                      src={product.imageURL}
                      alt={`${product.productDisplayName}`}
                      className="h-16 w-16 object-contain rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.productDisplayName}</p>
                      <p className="text-xs text-stone-600">Quantity: {quantity}</p>
                    </div>
                    <p className="font-semibold">${itemTotal.toFixed(2)}</p>
                  </div>
                );
              })}
              <div className="border-t border-stone-300 pt-4 mt-4">
                <div className="flex justify-between text-xl font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Checkout Form */}
          <aside className="lg:w-1/3" role="complementary" aria-label="Shipping information">
            <form 
              className="bg-stone-50 rounded-sm p-4 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckout();
              }}
              aria-label="Shipping and checkout form"
              data-agent-role="checkout-form"
              data-agent-hint="Complete all required fields (name, email, address, city, state, zipcode, country) to proceed with checkout. Form validates on submit."
              data-agent-expected="Order placed successfully, redirect to order confirmation page"
            >
              <div>
                <h3 className="block text-lg font-semibold text-stone-800 mb-1">
                  Shipping Details
                </h3>
                <p className="block text-sm text-stone-600 mb-2">
                  Provide a shipping address to finalise your order.
                </p>
              </div>
              <div className="grid gap-4">
                {fields.map(({ label, name, placeholder }) => {
                  const isSelect = name === "country" || name === "city";
                  const options = isSelect
                    ? name === "country"
                      ? countryOptions
                      : address.country && citiesByCountry[address.country]
                      ? citiesByCountry[address.country]
                      : []
                    : [];

                  return (
                    <div className="grid gap-1" key={name}>
                      <Label htmlFor={name}>{label}</Label>
                      {isSelect ? (
                        <select
                          id={name}
                          value={address[name]}
                          onChange={(e) => setAddress((p) => ({ ...p, [name]: e.target.value }))}
                          aria-invalid={!!errors[name]}
                          className={clsx(
                            "peer h-9 w-full cursor-pointer rounded-md border border-input bg-white px-3 pr-8 text-sm outline-none",
                            "hover:bg-accent/30 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                            errors[name] ? "border-red-500 focus:ring-red-500" : ""
                          )}
                          required
                          aria-required="true"
                          aria-describedby={errors[name] ? `${name}-error` : undefined}
                          data-testid={`checkout-${name}-select`}
                        >
                          <option value="" disabled>
                            {placeholder}
                          </option>
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          id={name}
                          type={name === "email" ? "email" : "text"}
                          placeholder={placeholder}
                          value={address[name]}
                          onChange={(e) =>
                            setAddress((p) => ({ ...p, [name]: e.target.value }))
                          }
                          className={clsx(
                            "bg-white focus:ring-2 focus:ring-blue-500",
                            errors[name] ? "border-red-500 focus:ring-red-500" : ""
                          )}
                          required
                          aria-invalid={!!errors[name]}
                          aria-required="true"
                          aria-describedby={errors[name] ? `${name}-error` : undefined}
                          data-testid={`checkout-${name}-input`}
                        />
                      )}
                      {errors[name] && (
                        <span id={`${name}-error`} className="text-xs text-red-600" role="alert">
                          This field is required
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <Button 
                type="submit" 
                className="w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
                aria-label="Complete checkout"
                data-testid="checkout-submit-button"
                disabled={processing}
              >
                {processing ? "Processing..." : "Complete Order"}
              </Button>
            </form>
          </aside>
        </div>
      </div>
    </main>
  );
}

