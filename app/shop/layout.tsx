import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Shop All Products",
  description: "Browse our complete collection of fashion, clothing, shoes, and accessories. Find the perfect style for every occasion.",
  keywords: "shop, products, fashion, clothing, shoes, accessories, browse, collection",
  url: "/shop",
});

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

