"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { fetchStyleById } from "@/lib/styleService";
import { QtSelect } from "@/components/ui/qt-select";
import { Trash } from "lucide-react";

interface ItemData {
  id: number;
  productDisplayName: string;
  priceUSD?: number;
  imageURL: string;
}

/* ──────────────────────────────────────────────────────────
   MAIN CART VIEW
   ──────────────────────────────────────────────────────────*/
export default function CartView() {
  const cartItems = useCartStore((s) => s.items);

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

  if (loading) {
    return (
      <div className="p-4" role="status" aria-live="polite" aria-busy="true">
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
          <ul className="flex flex-col gap-4" aria-label="Cart items">
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
          </ul>
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

        <aside className="lg:w-1/3" role="complementary" aria-label="Checkout summary">
          <div className="bg-stone-50 rounded-sm p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Order Summary</h3>
              <div className="text-2xl font-bold text-stone-800 mb-4">
                ${total.toFixed(2)}
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full"
              data-agent-role="checkout-button"
              data-agent-hint="Proceed to checkout page to complete order. Requires login."
            >
              <Button 
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
                aria-label="Proceed to checkout"
                data-testid="proceed-to-checkout-button"
              >
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
