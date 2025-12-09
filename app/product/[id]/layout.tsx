import { Metadata } from 'next';
import { getStylesCache } from '@/lib/styleCache';
import { generateMetadata as generateSEOMetadata, generateProductSchema, generateStructuredData } from '@/lib/seo';

interface ProductLayoutProps {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: ProductLayoutProps): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id);
  
  let product;
  try {
    const styles = getStylesCache();
    product = styles.find((style) => style.id === productId);
  } catch (error) {
    console.error('Error loading product for metadata:', error);
  }

  if (!product) {
    return generateSEOMetadata({
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.',
      noindex: true,
    });
  }

  return generateSEOMetadata({
    title: product.productDisplayName,
    description: `${product.productDisplayName} - ${product.articleType || ''} from ${product.masterCategory || 'THE STORE'}. Price: $${product.priceUSD || 0}`,
    keywords: `${product.productDisplayName}, ${product.articleType}, ${product.masterCategory}, ${product.baseColour}, fashion, clothing`,
    image: product.imageURL,
    url: `/product/${productId}`,
    type: 'product',
  });
}

export default async function ProductLayout({ params, children }: ProductLayoutProps) {
  const { id } = await params;
  const productId = parseInt(id);
  
  let product;
  try {
    const styles = getStylesCache();
    product = styles.find((style) => style.id === productId);
  } catch (error) {
    console.error('Error loading product:', error);
  }

  if (!product) {
    return <>{children}</>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  
  // Generate product schema with dates and potential reviews
  const productSchema = generateProductSchema({
    ...product,
    year: product.year,
    datePublished: product.year ? `${product.year}-01-01` : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago or year
    dateModified: new Date().toISOString().split('T')[0],
    aggregateRating: {
      ratingValue: 4.5, // Example rating - in production, calculate from actual reviews
      reviewCount: Math.floor(Math.random() * 50) + 10, // Example review count
    },
  });
  
  // Generate standalone BuyAction schema (checkout endpoint)
  const buyActionSchema = generateStructuredData('BuyAction', {
    targetUrl: `${baseUrl}/api/services/orders`,
    product: {
      '@type': 'Product',
      name: product.productDisplayName,
      url: `${baseUrl}/product/${productId}`,
    },
    productName: product.productDisplayName,
    productUrl: `${baseUrl}/product/${productId}`,
  });

  // Generate standalone AddToCartAction schema
  const addToCartActionSchema = generateStructuredData('AddToCartAction', {
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/cart`,
    },
    'httpMethod': 'GET',
    object: {
      '@type': 'Product',
      name: product.productDisplayName,
      url: `${baseUrl}/product/${productId}`,
    },
  });

  // Breadcrumb
  const breadcrumbSchema = generateStructuredData('BreadcrumbList', {
    items: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `${baseUrl}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.productDisplayName,
        item: `${baseUrl}/product/${productId}`,
      },
    ],
  });

  // ImageObject for product image with enhanced details
  const imageSchema = generateStructuredData('ImageObject', {
    contentUrl: product.imageURL,
    url: product.imageURL,
    caption: product.productDisplayName,
    description: `${product.productDisplayName}${product.articleType ? ` - ${product.articleType}` : ''}${product.baseColour ? ` in ${product.baseColour}` : ''}${product.masterCategory ? ` from ${product.masterCategory} collection` : ''} - $${product.priceUSD ?? 'N/A'} at THE STORE`,
    width: 800,
    height: 800,
    encodingFormat: 'image/jpeg',
    name: product.productDisplayName,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        id="buy-action-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buyActionSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(addToCartActionSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(imageSchema),
        }}
      />
      {children}
    </>
  );
}

