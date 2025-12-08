import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { generateStructuredData } from "@/lib/seo";
import StructuredData from "@/components/StructuredData";
import { generateHeadingId } from "@/lib/utils";
import HomePageClient from "@/components/HomePageClient";
import { getStylesCache } from "@/lib/styleCache";
import type { StyleItem } from "@/stores/stylesStore";

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
      className="p-8 bg-stone-200 h-72 rounded-sm hover:bg-stone-200 hover:shadow-sm hover:translate-y-[-2px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 block"
      aria-label={`Browse ${title} - ${description}`}
      data-testid={`home-category-${title.toLowerCase()}`}
    >
      <h3 id={generateHeadingId(title)} className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-stone-600">{description}</p>
    </Link>
  );
}

export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  
  // Fetch styles server-side for initial render
  let styles: StyleItem[] = [];
  try {
    styles = getStylesCache();
  } catch (error) {
    console.error('Error loading styles:', error);
  }

  const justIn = styles.slice(0, 4);

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

  // ImageObject schema for hero banner
  const heroImageSchema = generateStructuredData('ImageObject', {
    contentUrl: `${baseUrl}/cover.webp`,
    url: `${baseUrl}/cover.webp`,
    caption: 'Hero Banner - Welcome to THE STORE',
    description: 'Welcome to THE STORE - Shop the latest fashion trends, clothing, shoes, and accessories',
    width: 1500,
    height: 260,
  });

  // Key Facts schema for hero section
  const keyFactsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'THE STORE Key Facts',
    description: 'Key facts about THE STORE services and policies',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Free Shipping on orders over $50',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '30-Day Returns with easy returns and exchanges',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Secure Payments - All major credit cards accepted',
      },
    ],
  };

  return (
    <main className="bg-white" role="main" aria-label="Home page">
      <StructuredData data={heroImageSchema} id="hero-image-schema" />
      <StructuredData data={keyFactsSchema} id="key-facts-schema" />
      
      {/* Noscript fallback */}
      <noscript>
        <style>{`
          .js-only { display: none !important; }
        `}</style>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4 max-w-7xl mx-auto">
          <p className="text-yellow-800">
            <strong>JavaScript is disabled.</strong> Some features may not work. 
            <Link href="/shop" className="underline ml-1">Browse our shop</Link> to see all products.
          </p>
        </div>
      </noscript>

      {/* Hero Banner */}
      <section aria-label="Hero banner" role="banner">
        <h1 className="sr-only">THE STORE - Shop the latest fashion trends, clothing, shoes, and accessories</h1>
        <figure>
          <Image
            src="/cover.webp"
            alt="Hero banner showcasing THE STORE - Shop the latest fashion trends, clothing, shoes, and accessories. Modern e-commerce fashion retail website."
            className="w-full object-cover"
            width={1500}
            height={260}
            priority
            fetchPriority="high"
            quality={85}
            aria-hidden="false"
          />
          <figcaption className="sr-only">
            THE STORE - Your destination for the latest fashion trends, clothing, shoes, and accessories
          </figcaption>
        </figure>
        {/* Key Facts in Hero Section */}
        <div className="bg-stone-50 py-4 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="font-semibold text-stone-900">Free Shipping</p>
              <p className="text-stone-600">On orders over $50</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-stone-900">30-Day Returns</p>
              <p className="text-stone-600">Easy returns and exchanges</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-stone-900">Secure Payments</p>
              <p className="text-stone-600">All major cards accepted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Just In Section - Server Rendered */}
      <section 
        className="py-12 px-6 max-w-7xl mx-auto"
        aria-labelledby="just-in-heading"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="just-in-heading" className="text-3xl font-semibold">Just In</h2>
          <Link
            href="/shop/just-in"
            className="text-stone-700 flex items-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-label="View all just in products"
            data-testid="view-all-just-in-link"
          >
            View all
            <ArrowRight 
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" 
              aria-hidden="true"
            />
          </Link>
        </div>
        
        {/* Server-rendered products */}
        {justIn.length > 0 ? (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            role="list"
            aria-label={`Just in products, ${justIn.length} items`}
          >
            {justIn.map((item) => {
              const productImageSchema = generateStructuredData('ImageObject', {
                contentUrl: item.imageURL,
                url: item.imageURL,
                caption: item.productDisplayName,
                description: `${item.productDisplayName} - ${item.articleType || ''}`,
              });
              return (
                <div key={item.id} role="listitem">
                  <StructuredData data={productImageSchema} id={`product-image-${item.id}-schema`} />
                  <article className="border border-stone-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <Link 
                      href={`/product/${item.id}`} 
                      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      data-testid={`product-link-${item.id}`}
                    >
                      <div className="relative w-full aspect-square bg-stone-100">
                        <Image
                          src={item.imageURL}
                          alt={`${item.productDisplayName}${item.baseColour ? ` in ${item.baseColour}` : ''}${item.articleType ? ` - ${item.articleType}` : ''}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover"
                          loading="lazy"
                          fetchPriority="low"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-stone-800 mb-1 line-clamp-2">{item.productDisplayName}</h3>
                        <p className="text-stone-600 text-sm mb-2">{item.articleType || item.masterCategory}</p>
                        <p className="text-lg font-bold text-stone-900">${item.priceUSD ?? 'N/A'}</p>
                      </div>
                    </Link>
                  </article>
                </div>
              );
            })}
          </div>
        ) : (
          <div 
            role="status" 
            aria-live="polite" 
            aria-label="Loading products"
            aria-busy="true"
          >
            <div className="flex items-center gap-2">
              <div 
                className="animate-spin rounded-full h-5 w-5 border-b-2 border-stone-800"
                aria-hidden="true"
              ></div>
              <p>Loading products...</p>
            </div>
          </div>
        )}
        
        {/* Client-side hydration for interactivity */}
        <HomePageClient />
      </section>

      {/* Press Mentions */}
      <section 
        className="py-12 px-6 bg-stone-50"
        aria-labelledby="press-heading"
      >
        <div className="max-w-7xl mx-auto">
          <h2 id="press-heading" className="text-2xl font-semibold mb-6 text-center">As Featured In</h2>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="text-stone-600 font-semibold">Fashion Weekly</div>
            <div className="text-stone-600 font-semibold">Style Magazine</div>
            <div className="text-stone-600 font-semibold">Retail Today</div>
            <div className="text-stone-600 font-semibold">E-commerce News</div>
          </div>
        </div>
      </section>

      {/* Offers and Categories */}
      <section 
        className="py-12 px-6"
        aria-labelledby="categories-heading"
      >
        <h2 id="categories-heading" className="sr-only">Shop by Category</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="Shop categories">
          {callouts.map((callout) => (
            <div key={callout.title} role="listitem">
              <HomeCallout
                title={callout.title}
                description={callout.description}
                path={callout.path}
              />
            </div>
          ))}
          <div role="listitem">
            <Link
              href="/shop/offers"
              className="col-span-2 p-8 bg-stone-500 h-72 rounded-sm
              hover:bg-stone-600 hover:shadow-sm
              hover:-translate-y-1 transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 block"
              aria-label="View special offers and deals"
              data-testid="home-offers-link"
            >
              <h3 id="offers" className="text-xl font-semibold mb-2 text-stone-50">Offers</h3>
              <p className="text-stone-200">Discover our best deals</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
