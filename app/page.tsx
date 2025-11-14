"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useStylesStore } from "@/stores/stylesStore";
import StyleCard from "@/components/ItemCard";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

function HomeCallout({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return (
    <Link
      href={path}
      className="p-8 bg-stone-200 h-72 rounded-sm hover:bg-stone-200 hover:shadow-sm hover:translate-y-[-2px] transition-all duration-300"
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-stone-600">{description}</p>
    </Link>
  );
}

export default function HomePage() {
  const { data, loading, fetchStyles } = useStylesStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchStyles();
  }, [fetchStyles]);

  useEffect(() => {
    // Check if user just registered
    const registered = searchParams.get("registered");
    const name = searchParams.get("name");
    
    if (registered === "true" && name) {
      const userName = decodeURIComponent(name);
      
      // Show toast notification
      toast.success(`Registered user: ${userName}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Remove query params from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("registered");
      newUrl.searchParams.delete("name");
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    }
  }, [searchParams, router]);

  const justIn = data.slice(0, 4);

  const callouts = [
    {
      title: "Clothes",
      description: "Shop the latest apparel",
      path: "/shop/clothes",
    },
    {
      title: "Shoes",
      description: "Browse our footwear",
      path: "/shop/shoes",
    },
    {
      title: "Accessories",
      description: "View our accessories",
      path: "/shop/accessories",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <Image
        src="/cover.webp"
        alt="Hero Banner"
        className="w-full object-cover"
        width={1500}
        height={260}
      />

      {/* Just In Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold">Just In</h2>
          <Link
            href="/shop/just-in"
            className="text-stone-700 flex items-center group"
          >
            View all
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {justIn.map((item) => (
              <StyleCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Offers and Categories */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {callouts.map((callout) => (
            <HomeCallout
              key={callout.title}
              title={callout.title}
              description={callout.description}
              path={callout.path}
            />
          ))}
          <Link
            href="/shop/offers"
            className="col-span-2 p-8 bg-stone-500 h-72 rounded-sm
            hover:bg-stone-600 hover:shadow-sm
            hover:-translate-y-1 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold mb-2 text-stone-50">Offers</h3>
            <p className="text-stone-200">Discover our best deals</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
