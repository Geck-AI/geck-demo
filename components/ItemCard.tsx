import React from "react";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/stores/cartStore";
import { Minus, Plus } from "lucide-react";

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

  const handleAddToCart = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    addItem(item.id);
  };

  const handleCardClick = () => {
    router.push(`/product/${item.id}`);
  };

  return (
    <div 
      className="flex flex-col h-full cursor-pointer bg-stone-100 p-4 rounded-sm hover:bg-stone-200 transition-colors duration-200"
      onClick={handleCardClick}
    >
      {/* Product image */}
      <div className="flex-shrink-0">
        <img
          src={item.imageURL}
          alt={item.productDisplayName}
          className="w-full object-cover"
        />
      </div>
      
      {/* Product info and controls - using flex to push controls to bottom */}
      <div className="flex flex-col flex-grow justify-between mt-4">
        {/* Product title and price */}
        <div className="flex-shrink-0">
          <h3 className="font-medium text-sm text-stone-800 line-clamp-2 text-left">
            {item.productDisplayName}
          </h3>
          <span className="block text-base font-semibold text-stone-900 mt-1 text-left">
            {`$${item.priceUSD ?? "N/A"}`}
          </span>
        </div>
        
        {/* Cart controls - always at bottom */}
        <div className="flex-shrink-0 mt-4">
          {quantity > 0 ? (
            <div className="flex items-center md:gap-1">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  decrement(item.id);
                }}
                className="px-2 py-1 text-xs cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </div>
              <span className="text-sm w-4 text-center">{quantity}</span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  increment(item.id);
                }}
                className="px-2 py-1 text-xs cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(e);
              }}
              className="text-[12px] md:text-xs font-medium whitespace-nowrap text-black bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-sm cursor-pointer transition-colors duration-200 text-left w-fit shadow"
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
