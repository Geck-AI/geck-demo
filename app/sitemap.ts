import { MetadataRoute } from 'next';
import { getStylesCache } from '@/lib/styleCache';
import { getAllBlogPosts } from '@/lib/blogData';

export default function sitemap(): MetadataRoute.Sitemap {
  // Note: The sitemap is always available at /sitemap.xml regardless of domain
  // baseUrl is used for absolute URLs in the sitemap entries (required by sitemap spec)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.geck.ai';

  // Use current date for freshness
  const now = new Date();

  // Get all products from cache
  let productIds: number[] = [];
  try {
    const styles = getStylesCache();
    if (styles && styles.length > 0) {
      productIds = styles.map((style) => style.id).filter((id) => !isNaN(id) && id > 0);
    }
  } catch (error) {
    console.error('Error loading styles for sitemap:', error);
    // Fallback: return at least static pages even if products fail to load
  }

  // Static pages with recent lastModified dates
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop/just-in`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop/clothes`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop/shoes`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop/accessories`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop/offers`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/content-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/corrections-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/feedback`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/api/docs`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/staging-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/favorites`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/order-success`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/api-keys`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic product pages with recent dates
  const productPages: MetadataRoute.Sitemap = productIds.slice(0, 50000).map((id) => ({
    url: `${baseUrl}/product/${id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Dynamic blog post pages
  const blogPosts = getAllBlogPosts();
  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.dateModified),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Combine and ensure we have at least the static pages
  const allPages = [...staticPages, ...productPages, ...blogPostPages];

  // Ensure we return a valid sitemap (at minimum static pages)
  if (allPages.length === 0) {
    // Fallback: return at least homepage
    return [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }

  return allPages;
}

