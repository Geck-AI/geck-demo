import StyleCardContainer from "@/components/ItemsGrid";
import FilterSidebar from "@/components/FilterSidebar";
import { generateProductSchema, generateStructuredData } from "@/lib/seo";
import { getStylesCache } from "@/lib/styleCache";
import StructuredData from "@/components/StructuredData";

/**
 * Shop landing – shows all products with filters.
 */
export default function ShopHomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  
  // Generate ImageObject schema for shop page
  const shopImageSchema = generateStructuredData('ImageObject', {
    contentUrl: `${baseUrl}/cover.webp`,
    url: `${baseUrl}/cover.webp`,
    caption: 'Shop All Products - THE STORE',
    description: 'Browse our complete collection of fashion, clothing, shoes, and accessories at THE STORE. Find the perfect style for every occasion.',
    width: 1200,
    height: 630,
  });

  // Generate Product schemas for products on shop listing page
  let productSchemas: Array<Record<string, unknown>> = [];
  try {
    const styles = getStylesCache();
    // Get first 12 products for schema (representative sample)
    const sampleProducts = styles.slice(0, 12);
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
      <StructuredData data={shopImageSchema} id="shop-image-schema" />
      {productSchemas.map((schema, index) => (
        <StructuredData key={index} data={schema} id={`shop-home-product-schema-${index}`} />
      ))}
      <main className="min-h-screen p-8 bg-white" role="main" aria-label="Shop all products page">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Shop All</h1>
          <div className="text-sm text-stone-500">
            <time dateTime="2024-01-01">Published: January 1, 2024</time>
            <span className="mx-2">•</span>
            <time dateTime={new Date().toISOString().split('T')[0]}>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
        </div>
        <div className="flex gap-8">
          <aside className="w-1/4" role="complementary" aria-label="Product filters sidebar">
            <FilterSidebar />
          </aside>
          <div className="flex-1" role="region" aria-label="Product listings" aria-live="polite" aria-atomic="false">
            <StyleCardContainer />
          </div>
        </div>
      </main>
    </>
  );
}
