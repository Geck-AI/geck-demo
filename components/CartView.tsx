"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/stores/useAppStore";
import { useCartStore } from "@/stores/cartStore";
import { checkoutOrder } from "@/lib/orderService";
import { fetchStyleById } from "@/lib/styleService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { QtSelect } from "@/components/ui/qt-select";
import { Trash } from "lucide-react";

interface ItemData {
  id: number;
  productDisplayName: string;
  priceUSD?: number;
  imageURL: string;
}

/* ──────────────────────────────────────────────────────────
   FORM – collect shipping / payment details
   ──────────────────────────────────────────────────────────*/
function PaymentMethod({
  onCheckout,
}: {
  onCheckout: (address: {
    name: string;
    email: string;
    streetAddress: string;
    country: string;
    city: string;
    state: string;
    zipcode: string;
  }) => Promise<void>;
}) {
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

  function SelectField({
    id,
    name,
    placeholder,
    value,
    onChange,
    error,
    countryValue,
    "aria-invalid": ariaInvalid,
    required,
  }: {
    id: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    error: boolean;
    countryValue: string;
    "aria-invalid"?: boolean;
    required?: boolean;
  }) {
    const isCountry = name === "country";
    const options = isCountry
      ? countryOptions
      : countryValue && citiesByCountry[countryValue]
      ? citiesByCountry[countryValue]
      : [];
    return (
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={ariaInvalid}
          className={clsx(
            "peer h-9 w-full cursor-pointer rounded-md border border-input bg-white px-3 pr-8 text-sm outline-none",
            "hover:bg-accent/30 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            error ? "border-red-500 focus:ring-red-500" : ""
          )}
          required={required}
          aria-required="true"
          aria-describedby={error ? `${id}-error` : undefined}
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
      </div>
    );
  }
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

  const validateAndCheckout = () => {
    const newErrors: Partial<Record<keyof typeof address, boolean>> = {};
    (Object.keys(address) as (keyof typeof address)[]).forEach((k) => {
      if (!address[k].trim()) newErrors[k] = true;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onCheckout(address);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndCheckout();
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

  return (
    <form 
      className="bg-stone-50 rounded-sm p-4 flex flex-col gap-4"
      onSubmit={handleFormSubmit}
      aria-label="Shipping and checkout form"
      data-agent-role="checkout-form"
      data-agent-hint="Complete all required fields (name, email, address, city, state, zipcode, country) to proceed with checkout. Form validates on submit."
      data-agent-expected="Order placed successfully, redirect to order confirmation page"
    >
      <div>
        <h3 id="cart-item-title" className="block text-lg font-semibold text-stone-800 mb-1">
          Shipping Details
        </h3>
        <p className="block text-sm text-stone-600 mb-2">
          Provide a shipping address to finalise your order.
        </p>
      </div>
      <div className="grid gap-4">
        {fields.map(({ label, name, placeholder }) => {
          const isSelect = name === "country" || name === "city";
          return (
            <div className="grid gap-1" key={name}>
              <Label htmlFor={name}>{label}</Label>
              {isSelect ? (
                <SelectField
                  id={name}
                  name={name}
                  placeholder={placeholder}
                  value={address[name]}
                  onChange={(v) => setAddress((p) => ({ ...p, [name]: v }))}
                  error={!!errors[name]}
                  countryValue={address["country"]}
                  required
                  aria-invalid={!!errors[name]}
                  aria-required="true"
                  aria-describedby={errors[name] ? `${name}-error` : undefined}
                />
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
      >
        Checkout
      </Button>
    </form>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN CART VIEW
   ──────────────────────────────────────────────────────────*/
export default function CartView() {
  const { toast } = useToast();
  const router = useRouter();

  /* 1️⃣  Items in cart */
  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  /* 2️⃣  Store order history */
  const addOrder = useAppStore((s) => s.addOrder);

  const [productData, setProductData] = useState<Record<number, ItemData>>({});
  const [loading, setLoading] = useState(true);

  /* Fetch data for each product in cart */
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

  const handleCheckout = async (addr: {
    name: string;
    email: string;
    streetAddress: string;
    country: string;
    city: string;
    state: string;
    zipcode: string;
  }) => {
    if (cartItems.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }

    const itemsForOrder = cartItems.map(({ id, quantity }) => ({
      id,
      quantity,
      productDisplayName: productData[id]?.productDisplayName || "Unknown",
      imageURL: productData[id]?.imageURL || "",
      priceUSD: productData[id]?.priceUSD || 0,
    }));

    try {
      const res = await checkoutOrder({
        ...addr,
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
          name: addr.name,
          streetAddress: addr.streetAddress,
          city: addr.city,
          state: addr.state,
          zipcode: addr.zipcode,
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

        // Navigate straight to the success page
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
    }
  };

  if (loading) {
    return (
      <div className="p-4" role="status" aria-live="polite" aria-label="Loading cart details" aria-busy="true">
        <noscript>
          <p>Please enable JavaScript to view your cart.</p>
        </noscript>
        <div className="flex items-center gap-2 js-only">
          <div 
            className="animate-spin rounded-full h-5 w-5 border-b-2 border-stone-800"
            aria-hidden="true"
          ></div>
          <p>Loading cart details...</p>
        </div>
      </div>
    );
  }

  /* ─────────── Empty cart state ─────────── */
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8" role="region" aria-label="Empty shopping cart">
        <div className="text-center" role="status" aria-live="polite">
          <h2 id="empty-cart" className="text-2xl font-semibold text-stone-800 mb-4">Your Cart is Empty</h2>
          <p className="text-stone-600 mb-8">Start adding items to your cart to begin shopping.</p>
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-6 py-3 rounded-sm hover:bg-stone-800 transition-colors"
            aria-label="Continue shopping"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ─────────── default render ─────────── */
  return (
    <div className="flex flex-col p-4" role="region" aria-label="Shopping cart">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <section className="flex-1 lg:w-2/3 min-w-0 max-h-[80vh] overflow-y-auto" aria-labelledby="cart-items-heading">
          <h2 id="cart-items-heading" className="sr-only">Cart Items</h2>
          <div className="flex flex-col gap-4" role="list" aria-label="Cart items">
            {cartItems.map(({ id, quantity }) => {
                const product = productData[id];
                if (!product) return null;
                const unitPrice = product.priceUSD ?? 0;
                const itemTotal = unitPrice * quantity;
                return (
                  <article
                    key={id}
                    data-testid={`cart-item-${id}`}
                    data-price={unitPrice}
                    data-quantity={quantity}
                    className="flex items-center gap-4 bg-stone-50 rounded-sm p-4 min-h-[64px]"
                    role="listitem"
                    aria-label={`${product.productDisplayName}, quantity ${quantity}, price $${itemTotal.toFixed(2)}`}
                  >
                    {/* Product image */}
                    <figure className="flex-shrink-0">
                      <img
                        src={product.imageURL}
                        alt={`${product.productDisplayName} - Cart item - $${product.priceUSD ?? 'N/A'}`}
                        className="h-24 w-24 object-contain rounded"
                      />
                      <figcaption className="sr-only">
                        {product.productDisplayName} in shopping cart
                      </figcaption>
                    </figure>
                    {/* Product name */}
                    <div className="flex-1 min-w-0">
                      <span 
                        className="font-medium text-sm line-clamp-2"
                        data-testid="cart-item-name"
                      >
                        {product.productDisplayName}
                      </span>
                    </div>
                    {/* Quantity */}
                    <div className="w-16 flex items-center gap-2" role="group" aria-label={`Quantity controls for ${product.productDisplayName}`}>
                      <QtSelect
                        value={quantity}
                        onChange={(n) =>
                          useCartStore.getState().setItemQuantity(id, n)
                        }
                        aria-label={`Quantity for ${product.productDisplayName}`}
                      />
                      <button
                        type="button"
                        aria-label={`Remove ${product.productDisplayName} from cart`}
                        data-testid="remove-item-button"
                        onClick={() => {
                          useCartStore.getState().removeItem(id);
                        }}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      >
                        <Trash
                          className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-700"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    {/* Total price for this item */}
                    <div 
                      className="text-base font-semibold w-20 text-right"
                      data-testid="cart-item-total"
                      aria-label={`Item total: $${itemTotal.toFixed(2)}`}
                    >
                      ${itemTotal.toFixed(2)}
                    </div>
                  </article>
                );
              })}
          </div>
          <div className="mt-8 px-2 text-xl flex justify-between" data-testid="cart-total" role="group" aria-label="Cart total">
            <span className="text-stone-600 font-medium">Total</span>
            <span 
              className="text-stone-800 font-semibold" 
              data-testid="cart-total-amount" 
              aria-label={`Total amount: $${total.toFixed(2)}`}
              aria-live="polite"
              aria-atomic="true"
            >
              ${total.toFixed(2)}
            </span>
          </div>
        </section>

        <aside className="lg:w-1/3" role="complementary" aria-label="Checkout form">
          <PaymentMethod onCheckout={handleCheckout} />
        </aside>
      </div>
    </div>
  );
}
