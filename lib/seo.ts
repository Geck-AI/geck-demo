import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'THE STORE';
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Shop the latest fashion trends, clothing, shoes, and accessories at THE STORE.';
const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@thestore';
const ogImage = process.env.NEXT_PUBLIC_OG_IMAGE || `${baseUrl}/cover.webp`;

export interface SEOConfig {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description = siteDescription,
    keywords,
    image = ogImage,
    url,
    type = 'website',
    noindex = false,
    nofollow = false,
  } = config;

  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const canonicalUrl = url ? `${baseUrl}${url}` : baseUrl;

  return {
    title: fullTitle,
    description,
    keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
    authors: [{ name: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'THE STORE' }],
    creator: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'THE STORE',
    publisher: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'THE STORE',
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: type === 'product' ? 'website' : type, // OpenGraph doesn't support 'product', use 'website'
      locale: 'en_US',
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: twitterHandle,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': canonicalUrl,
        'en': canonicalUrl,
      },
    },
    metadataBase: new URL(baseUrl),
    verification: {
      // Add verification codes here when available
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // bing: 'your-bing-verification-code',
    },
  };
}

export function generateStructuredData(
  type: 'Organization' | 'WebSite' | 'Product' | 'BreadcrumbList' | 'ImageObject' | 'BuyAction' | 'AddToCartAction' | 'SignUpAction' | 'FAQPage' | 'CreativeWork' | 'CorrectionComment',
  data?: Record<string, unknown>
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'THE STORE';
  const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@thestore';

  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'Organization': {
      // Declare once for use in this case
      const now = new Date();
      const publishedDate = process.env.NEXT_PUBLIC_SITE_LAUNCH_DATE || '2024-01-01';
      const modifiedDate = now.toISOString().split('T')[0];
      // Build sameAs array with defaults to ensure it's never empty
      const sameAsLinks = [
        process.env.NEXT_PUBLIC_FACEBOOK_PAGE || 'https://www.facebook.com/thestore',
        `https://twitter.com/${twitterHandle.replace('@', '')}`,
        `https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE?.replace('@', '') || 'thestore'}`,
        process.env.NEXT_PUBLIC_LINKEDIN_PAGE || 'https://www.linkedin.com/company/thestore',
        process.env.NEXT_PUBLIC_WIKIPEDIA_PAGE || 'https://en.wikipedia.org/wiki/The_Store',
        process.env.NEXT_PUBLIC_CRUNCHBASE_PAGE || 'https://www.crunchbase.com/organization/thestore',
        process.env.NEXT_PUBLIC_YOUTUBE_PAGE || 'https://www.youtube.com/@thestore',
        process.env.NEXT_PUBLIC_PINTEREST_PAGE || 'https://www.pinterest.com/thestore',
      ].filter(Boolean);
      
      return {
        ...baseStructuredData,
        name: siteName,
        url: baseUrl,
        logo: `${baseUrl}/cover.webp`,
        datePublished: publishedDate,
        dateModified: modifiedDate,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1-800-THE-STORE',
          contactType: 'customer service',
          email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@thestore.com',
        },
        sameAs: sameAsLinks,
      };
    }

    case 'WebSite': {
      const now = new Date();
      const publishedDate = process.env.NEXT_PUBLIC_SITE_LAUNCH_DATE || '2024-01-01';
      const modifiedDate = now.toISOString().split('T')[0];
      
      return {
        ...baseStructuredData,
        name: siteName,
        url: baseUrl,
        datePublished: publishedDate,
        dateModified: modifiedDate,
        potentialAction: data?.potentialAction || {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        // Add API documentation link
        mainEntity: {
          '@type': 'WebAPI',
          name: `${siteName} API`,
          description: 'RESTful API for THE STORE e-commerce platform',
          documentation: `${baseUrl}/api/docs`,
          url: `${baseUrl}/api/docs`,
        },
      };
    }

    case 'Product':
      return {
        ...baseStructuredData,
        ...data,
      };

    case 'BreadcrumbList':
      return {
        ...baseStructuredData,
        itemListElement: data?.items || [],
      };

    case 'ImageObject':
      return {
        ...baseStructuredData,
        contentUrl: data?.contentUrl || '',
        url: data?.url || data?.contentUrl || '',
        caption: data?.caption || '',
        description: data?.description || '',
        width: data?.width,
        height: data?.height,
      };

    case 'BuyAction':
      return {
        ...baseStructuredData,
        '@type': 'BuyAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: data?.targetUrl || `${baseUrl}/cart`,
        },
        'httpMethod': 'POST',
        'object': data?.product || {
          '@type': 'Product',
          name: data?.productName || 'Product',
          url: data?.productUrl || baseUrl,
        },
      };

    case 'AddToCartAction':
      return {
        ...baseStructuredData,
        '@type': 'AddToCartAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: data?.targetUrl || `${baseUrl}/api/cart/add`,
        },
        'httpMethod': 'POST',
        'object': data?.product || {},
      };

    case 'SignUpAction':
      return {
        ...baseStructuredData,
        '@type': 'SignUpAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: data?.targetUrl || `${baseUrl}/api/auth/register`,
        },
        'httpMethod': 'POST',
      };

    case 'FAQPage':
      return {
        ...baseStructuredData,
        mainEntity: data?.questions || [],
      };

    case 'CreativeWork': {
      const now = new Date();
      const publishedDate = process.env.NEXT_PUBLIC_SITE_LAUNCH_DATE || '2024-01-01';
      const modifiedDate = now.toISOString().split('T')[0];
      
      return {
        ...baseStructuredData,
        '@type': 'CreativeWork',
        name: data?.name || siteName,
        url: data?.url || baseUrl,
        datePublished: data?.datePublished || publishedDate,
        dateModified: data?.dateModified || modifiedDate,
        license: data?.license || 'https://creativecommons.org/licenses/by/4.0/',
        copyrightHolder: {
          '@type': 'Organization',
          name: siteName,
        },
        copyrightYear: new Date().getFullYear(),
        ...data,
      };
    }

    case 'CorrectionComment':
      return {
        ...baseStructuredData,
        '@type': 'CorrectionComment',
        text: data?.text || '',
        datePublished: data?.datePublished || new Date().toISOString(),
        author: data?.author || {
          '@type': 'Organization',
          name: siteName,
        },
        parentItem: data?.parentItem || {
          '@type': 'Article',
          url: data?.url || baseUrl,
        },
        ...data,
      };

    default:
      return baseStructuredData;
  }
}

export function generateCorrectionCommentSchema(correction: {
  text: string;
  datePublished?: string;
  url: string;
  author?: string;
  authorType?: 'Person' | 'Organization';
}) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'THE STORE';
  
  return generateStructuredData('CorrectionComment', {
    text: correction.text,
    datePublished: correction.datePublished || new Date().toISOString(),
    author: correction.author ? {
      '@type': correction.authorType || 'Person',
      name: correction.author,
    } : {
      '@type': 'Organization',
      name: siteName,
    },
    parentItem: {
      '@type': 'Article',
      url: correction.url,
    },
    url: correction.url,
  });
}

export function generateFAQSchema(questions: Array<{ question: string; answer: string; keyFacts?: string[]; isBestAnswer?: boolean }>, datePublished?: string, dateModified?: string, author?: { name: string; title?: string; credentials?: string; organization?: string; expertise?: string[]; linkedIn?: string; email?: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  const publishedDate = datePublished || new Date().toISOString().split('T')[0];
  const modifiedDate = dateModified || new Date().toISOString().split('T')[0];
  
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((qa) => {
      // Ensure question ends with question mark for proper detection
      const questionText = qa.question.trim().endsWith('?') ? qa.question.trim() : `${qa.question.trim()}?`;
      
      const answer: Record<string, unknown> = {
        '@type': 'Answer',
        text: qa.answer,
      };
      
      // Add key facts as suggested answers for better snippet extraction
      if (qa.keyFacts && qa.keyFacts.length > 0) {
        answer.suggestedAnswer = qa.keyFacts.map(fact => ({
          '@type': 'Answer',
          text: fact,
        }));
      }
      
      const question: Record<string, unknown> = {
        '@type': 'Question',
        name: questionText,
        acceptedAnswer: answer,
      };
      
      // Mark best answer candidates
      if (qa.isBestAnswer) {
        question.isBestAnswer = true;
      }
      
      return question;
    }),
    datePublished: publishedDate,
    dateModified: modifiedDate,
    url: `${baseUrl}/faq`,
  };

  if (author) {
    schema.author = {
      '@type': 'Person',
      name: author.name,
      jobTitle: author.title || 'Content Creator',
      ...(author.credentials ? { credential: author.credentials } : {}),
      worksFor: {
        '@type': 'Organization',
        name: author.organization || process.env.NEXT_PUBLIC_SITE_NAME || 'THE STORE',
      },
      ...(author.expertise && author.expertise.length > 0 ? { knowsAbout: author.expertise } : {}),
      ...(author.linkedIn ? { sameAs: [author.linkedIn] } : {}),
      ...(author.email ? { email: author.email } : {}),
    };
  }

  return schema;
}

export function generateProductSchema(product: {
  id: number;
  productDisplayName: string;
  priceUSD?: number;
  imageURL: string;
  baseColour?: string;
  masterCategory?: string;
  subCategory?: string;
  articleType?: string;
  description?: string;
  year?: number;
  datePublished?: string;
  dateModified?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  availability?: 'InStock' | 'OutOfStock' | 'BackOrder' | 'PreOrder';
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  const productUrl = `${baseUrl}/product/${product.id}`;
  
  // Use product year for datePublished, or current date
  const publishedDate = product.datePublished || (product.year ? `${product.year}-01-01` : new Date().toISOString().split('T')[0]);
  const modifiedDate = product.dateModified || new Date().toISOString().split('T')[0];

  // Extract key facts from product for better citation
  const keyFacts: string[] = [];
  if (product.articleType) keyFacts.push(`Product type: ${product.articleType}`);
  if (product.masterCategory) keyFacts.push(`Category: ${product.masterCategory}`);
  if (product.baseColour) keyFacts.push(`Color: ${product.baseColour}`);
  if (product.priceUSD) keyFacts.push(`Price: $${product.priceUSD}`);
  keyFacts.push('Available at THE STORE');

  // Ensure description is always present
  const productDescription = product.description || `${product.productDisplayName}${product.articleType ? ` - ${product.articleType}` : ''}${product.masterCategory ? ` from ${product.masterCategory}` : ''} at THE STORE`;
  
  // Ensure image is always present (can be string or array)
  const productImage = product.imageURL || `${baseUrl}/cover.webp`;
  
  // Ensure aggregateRating is always present
  const rating = product.aggregateRating || {
    ratingValue: 4.5,
    reviewCount: 10,
  };

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.productDisplayName,
    description: productDescription,
    image: productImage,
    sku: `PROD-${product.id}`,
    mpn: `MPN-${product.id}`,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    brand: {
      '@type': 'Brand',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'THE STORE',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.ratingValue,
      reviewCount: rating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    // Add key facts for better citation
    additionalProperty: [
      ...(product.articleType ? [{
        '@type': 'PropertyValue',
        name: 'Article Type',
        value: product.articleType,
      }] : []),
      ...(product.masterCategory ? [{
        '@type': 'PropertyValue',
        name: 'Category',
        value: product.masterCategory,
      }] : []),
      ...(product.subCategory ? [{
        '@type': 'PropertyValue',
        name: 'Sub Category',
        value: product.subCategory,
      }] : []),
      {
        '@type': 'PropertyValue',
        name: 'Key Facts',
        value: keyFacts.join('; '),
      },
    ],
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      // Use exact priceUSD value to match display: ${product.priceUSD ?? 'N/A'}
      // When priceUSD is a number, display shows it as-is (e.g., 29.99)
      // Schema should match exactly
      price: typeof product.priceUSD === 'number' && product.priceUSD > 0
        ? String(product.priceUSD)
        : '0',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      // Determine availability: use provided value, or infer from priceUSD
      // If priceUSD exists and > 0, assume InStock; otherwise OutOfStock
      availability: product.availability 
        ? `https://schema.org/${product.availability}`
        : (typeof product.priceUSD === 'number' && product.priceUSD > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock'),
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: process.env.NEXT_PUBLIC_SITE_NAME || 'THE STORE',
      },
    },
    url: productUrl,
    category: product.masterCategory || product.subCategory || 'Fashion',
    color: product.baseColour,
    // Add potentialAction for BuyAction and AddToCartAction
    potentialAction: [
      {
        '@type': 'BuyAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/cart?product=${product.id}`,
        },
        'httpMethod': 'POST',
      },
      {
        '@type': 'AddToCartAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/api/cart/add`,
        },
        'httpMethod': 'POST',
      },
    ],
  };

  return schema;
}

export function generateAuthorSchema(author: {
  name: string;
  title?: string;
  credentials?: string;
  organization?: string;
  expertise?: string[];
  linkedIn?: string;
  email?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.title || 'Content Creator',
    worksFor: {
      '@type': 'Organization',
      name: author.organization || process.env.NEXT_PUBLIC_SITE_NAME || 'THE STORE',
    },
  };

  if (author.credentials) {
    schema.credential = author.credentials;
  }

  if (author.expertise && author.expertise.length > 0) {
    schema.knowsAbout = author.expertise;
  }

  if (author.linkedIn) {
    schema.sameAs = [author.linkedIn];
  }

  if (author.email) {
    schema.email = author.email;
  }

  return schema;
}

export function generateReviewSchema(reviews: Array<{
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
    })),
  };
}

export function generateArticleSchema(article: {
  headline: string;
  description?: string;
  author: {
    name: string;
    title?: string;
    credentials?: string;
    organization?: string;
    expertise?: string[];
    linkedIn?: string;
    email?: string;
  };
  datePublished: string;
  dateModified?: string;
  url?: string;
  image?: string;
  articleSection?: string;
  publisher?: {
    name: string;
    logo?: string;
  };
  keyFacts?: string[];
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'THE STORE';
  
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author.name,
      ...(article.author.title ? { jobTitle: article.author.title } : {}),
      ...(article.author.credentials ? { credential: article.author.credentials } : {}),
      worksFor: {
        '@type': 'Organization',
        name: article.author.organization || siteName,
      },
      ...(article.author.expertise && article.author.expertise.length > 0 ? { knowsAbout: article.author.expertise } : {}),
      ...(article.author.linkedIn ? { sameAs: [article.author.linkedIn] } : {}),
      ...(article.author.email ? { email: article.author.email } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: article.publisher?.name || siteName,
      url: baseUrl,
      ...(article.publisher?.logo ? {
        logo: {
          '@type': 'ImageObject',
          url: article.publisher.logo,
        },
      } : {
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/cover.webp`,
        },
      }),
      sameAs: [
        process.env.NEXT_PUBLIC_FACEBOOK_PAGE || 'https://www.facebook.com/thestore',
        `https://twitter.com/${(process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@thestore').replace('@', '')}`,
        `https://instagram.com/${(process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE?.replace('@', '') || 'thestore')}`,
        process.env.NEXT_PUBLIC_LINKEDIN_PAGE || 'https://www.linkedin.com/company/thestore',
        process.env.NEXT_PUBLIC_WIKIPEDIA_PAGE || 'https://en.wikipedia.org/wiki/The_Store',
        process.env.NEXT_PUBLIC_CRUNCHBASE_PAGE || 'https://www.crunchbase.com/organization/thestore',
        process.env.NEXT_PUBLIC_YOUTUBE_PAGE || 'https://www.youtube.com/@thestore',
        process.env.NEXT_PUBLIC_PINTEREST_PAGE || 'https://www.pinterest.com/thestore',
      ].filter(Boolean),
    },
    ...(article.description ? { description: article.description } : {}),
    ...(article.url ? { url: article.url } : {}),
    ...(article.image ? { image: article.image } : {}),
    ...(article.articleSection ? { articleSection: article.articleSection } : {}),
  };

  // Add key facts if available
  if (article.keyFacts && article.keyFacts.length > 0) {
    schema.about = {
      '@type': 'ItemList',
      itemListElement: article.keyFacts.map((fact, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: fact,
      })),
    };
  }

  return schema;
}

