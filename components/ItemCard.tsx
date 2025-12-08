import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Minus, Plus, Heart } from "lucide-react";

interface ItemCardProps {
  item: {
    id: number;
    productDisplayName: string;
    baseColour: string;
    priceUSD?: number;
    imageURL: string;
  };
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const increment = useCartStore((s) => s.incrementItem);
  const decrement = useCartStore((s) => s.decrementItem);
  const quantity = useCartStore(
    (s) => s.items.find((i) => i.id === item.id)?.quantity || 0
  );
  const toggleFavorite = useFavoritesStore((s) => s.toggleItem);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(item.id));

  const handleAddToCart = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    addItem(item.id);
    toast.success(`${item.productDisplayName} added to cart!`);
  };

  const handleCardClick = () => {
    router.push(`/product/${item.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  };

  return (
    <article 
      className="flex flex-col h-full cursor-pointer bg-stone-100 p-4 rounded-sm hover:bg-stone-200 transition-colors duration-200 relative focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="article"
      aria-label={`Product: ${item.productDisplayName}, Price: $${item.priceUSD ?? "N/A"}`}
      tabIndex={0}
    >
      {/* Favorite button */}
      <button
        type="button"
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={isFavorite ? `Remove ${item.productDisplayName} from favorites` : `Add ${item.productDisplayName} to favorites`}
        aria-pressed={isFavorite}
        data-testid={`product-${item.id}-favorite-button`}
        data-agent-role="favorite-button"
        data-agent-action="toggle-favorite"
        data-agent-hint={`Click to ${isFavorite ? 'remove from' : 'add to'} favorites. Heart icon shows current state.`}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isFavorite
              ? "text-red-600 fill-red-600"
              : "text-stone-400 hover:text-red-400"
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Product image */}
      <figure className="flex-shrink-0">
        <img
          src={item.imageURL}
          alt={`${item.productDisplayName}${item.baseColour ? ` in ${item.baseColour}` : ''}${item.priceUSD ? ` - $${item.priceUSD}` : ''} - Available at THE STORE`}
          className="w-full object-cover"
        />
        <figcaption className="sr-only">
          Product image: {item.productDisplayName}
          {item.baseColour && ` in ${item.baseColour}`}
          {item.priceUSD && ` - $${item.priceUSD}`}
        </figcaption>
      </figure>
      
      {/* Product info and controls - using flex to push controls to bottom */}
      <div className="flex flex-col flex-grow justify-between mt-4">
        {/* Product title and price */}
        <div className="flex-shrink-0">
          <h3 className="font-medium text-sm text-stone-800 line-clamp-2 text-left">
            {item.productDisplayName}
          </h3>
          <span className="block text-base font-semibold text-stone-900 mt-1 text-left" aria-label={`Price: $${item.priceUSD ?? "N/A"}`}>
            {`$${item.priceUSD ?? "N/A"}`}
          </span>
        </div>
        
        {/* Cart controls - always at bottom */}
        <div className="flex-shrink-0 mt-4" role="group" aria-label="Cart quantity controls">
          {quantity > 0 ? (
            <div className="flex items-center md:gap-1" role="group" aria-label={`Quantity selector for ${item.productDisplayName}`}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  decrement(item.id);
                }}
                className="px-2 py-1 text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label={`Decrease quantity of ${item.productDisplayName}`}
                disabled={quantity <= 1}
                aria-disabled={quantity <= 1}
                data-testid={`product-${item.id}-decrement-button`}
                data-agent-role="quantity-decrement"
                data-agent-action="decrease-quantity"
                data-agent-hint="Click to decrease quantity by 1. Disabled when quantity is 1."
              >
                <Minus className="w-3 h-3" aria-hidden="true" />
              </button>
              <span 
                className="text-sm w-4 text-center"
                aria-label={`Current quantity: ${quantity}`}
                aria-live="polite"
                aria-atomic="true"
                data-testid={`product-${item.id}-quantity`}
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  increment(item.id);
                  toast.success(`Added one more ${item.productDisplayName} to cart!`);
                }}
                className="px-2 py-1 text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label={`Increase quantity of ${item.productDisplayName}`}
                data-testid={`product-${item.id}-increment-button`}
                data-agent-role="quantity-increment"
                data-agent-action="increase-quantity"
                data-agent-hint="Click to increase quantity by 1. Adds item to cart if not already added."
              >
                <Plus className="w-3 h-3" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(e);
              }}
              className="text-[12px] md:text-xs font-medium whitespace-nowrap text-black bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-sm cursor-pointer transition-colors duration-200 text-left w-fit shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Add ${item.productDisplayName} to cart`}
              data-testid={`product-${item.id}-add-to-cart-button`}
              data-agent-role="add-to-cart-button"
              data-agent-action="add-to-cart"
              data-agent-hint="Click to add product to shopping cart. Quantity controls appear after adding."
              data-agent-expected="Product added to cart, quantity controls shown"
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ItemCard;
