import { notFound } from "next/navigation";
import { Metadata } from "next";
import ShopPageContent from "@/components/ShopPageContent";
import { categoryFilter } from "@/lib/shopConfig";
import { generateMetadata as generateSEOMetadata, generateProductSchema, generateStructuredData } from "@/lib/seo";
import { getStylesCache } from "@/lib/styleCache";
import StructuredData from "@/components/StructuredData";

interface ShopCategoryPageProps {
  params: Promise<{ category: string }>;
}

const categoryNames: Record<string, string> = {
  "just-in": "Just In",
  clothes: "Clothes",
  shoes: "Shoes",
  accessories: "Accessories",
  offers: "Special Offers",
};

const categoryDescriptions: Record<string, string> = {
  "just-in": "Discover our latest arrivals - newest fashion items just added to THE STORE.",
  clothes: "Shop the latest clothing and apparel. Find trendy outfits, casual wear, and formal attire.",
  shoes: "Browse our collection of footwear. From sneakers to boots, find the perfect pair.",
  accessories: "Complete your look with our accessories. Bags, jewelry, watches, and more.",
  offers: "Special deals and offers. Save on your favorite fashion items with exclusive discounts.",
};

export async function generateMetadata({ params }: ShopCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryName = categoryNames[category] || category;
  const description = categoryDescriptions[category] || `Shop ${categoryName} at THE STORE.`;

  return generateSEOMetadata({
    title: `Shop ${categoryName}`,
    description,
    keywords: `${category}, fashion, ${categoryName.toLowerCase()}, shopping, THE STORE`,
    url: `/shop/${category}`,
  });
}

/**
 * Server component for /shop/[category]
 */
export default async function ShopCategoryPage({
  params,
}: ShopCategoryPageProps) {
  const { category } = await params;
  // Validate category
  if (!(category in categoryFilter)) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  const categoryName = categoryNames[category] || category;
  const description = categoryDescriptions[category] || `Shop ${categoryName} at THE STORE.`;

  // Generate ImageObject schema for category page
  const categoryImageSchema = generateStructuredData('ImageObject', {
    contentUrl: `${baseUrl}/cover.webp`,
    url: `${baseUrl}/cover.webp`,
    caption: `Shop ${categoryName} - THE STORE`,
    description: description,
    width: 1200,
    height: 630,
  });

  // Generate Product schemas for products in this category
  let productSchemas: Array<Record<string, unknown>> = [];
  try {
    const styles = getStylesCache();
    const cfg = categoryFilter[category];
    
    // Filter products by category
    let categoryProducts: typeof styles = [];
    if (cfg && cfg.key === 'masterCategory') {
      categoryProducts = styles.filter((style) => style.masterCategory === cfg.value);
    } else if (cfg && cfg.key === 'subCategory') {
      categoryProducts = styles.filter((style) => style.subCategory === cfg.value);
    } else {
      // For "just-in" and "offers" (null config), show first 12 products
      categoryProducts = styles;
    }

    // Get first 12 products for schema (representative sample)
    const sampleProducts = categoryProducts.slice(0, 12);
    productSchemas = sampleProducts.map(product => 
      generateProductSchema({
        ...product,
        datePublished: product.year ? `${product.year}-01-01` : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0],
        aggregateRating: {
          ratingValue: 4.5,
          reviewCount: Math.floor(Math.random() * 50) + 10,
        },
      })
    );
  } catch (error) {
    console.error('Error loading products for schema:', error);
  }

  return (
    <>
      <StructuredData data={categoryImageSchema} id={`category-image-schema-${category}`} />
      {productSchemas.map((schema, index) => (
        <StructuredData key={index} data={schema} id={`category-product-schema-${category}-${index}`} />
      ))}
      <ShopPageContent category={category} />
    </>
  );
}
