import { notFound } from "next/navigation";
import { Metadata } from "next";
import ShopPageContent from "@/components/ShopPageContent";
import { categoryFilter } from "@/lib/shopConfig";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

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
  return <ShopPageContent category={category} />;
}
