"use client";

import Link from "next/link";
import { 
  Sparkles, 
  Shirt, 
  Footprints, 
  Watch, 
  Tag 
} from "lucide-react";

const categories = [
  { 
    label: "Just In", 
    href: "/shop/just-in", 
    icon: Sparkles,
    color: "text-blue-600"
  },
  { 
    label: "Clothes", 
    href: "/shop/clothes", 
    icon: Shirt,
    color: "text-purple-600"
  },
  { 
    label: "Shoes", 
    href: "/shop/shoes", 
    icon: Footprints,
    color: "text-orange-600"
  },
  { 
    label: "Accessories", 
    href: "/shop/accessories", 
    icon: Watch,
    color: "text-green-600"
  },
  { 
    label: "Offers", 
    href: "/shop/offers", 
    icon: Tag,
    color: "text-red-600"
  },
];

export default function CategorySubheader() {
  return (
    <div className="w-full bg-white py-3">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-6 md:gap-8 overflow-x-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.href}
                href={category.href}
                className="flex flex-col items-center gap-1 min-w-[80px] hover:opacity-80 transition-opacity group"
              >
                <div className={`p-2 rounded-full bg-stone-100 group-hover:bg-stone-200 transition-colors ${category.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-stone-700 font-medium whitespace-nowrap">
                  {category.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

