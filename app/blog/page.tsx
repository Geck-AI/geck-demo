import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import Link from 'next/link';
import { generateHeadingId } from '@/lib/utils';
import CorrectionNote from '@/components/CorrectionNote';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Blog & News',
  description: 'Stay updated with the latest fashion trends, style tips, and news from THE STORE.',
  keywords: 'blog, news, fashion, style, trends, THE STORE',
  url: '/blog',
});

const blogPosts = [
  {
    id: 1,
    title: 'Spring 2025 Fashion Trends: What to Wear This Season',
    excerpt: 'Discover the hottest fashion trends for spring 2025. From bold colors to sustainable fashion, we\'ve got you covered.',
    author: {
      name: 'Sarah Johnson',
      title: 'Fashion Editor',
      credentials: 'Certified Fashion Stylist, 10+ years experience',
      organization: 'THE STORE',
      expertise: ['Fashion Trends', 'Style Consulting', 'Sustainable Fashion'],
      linkedIn: 'https://www.linkedin.com/in/sarahjohnson',
      email: 'sarah@thestore.com',
    },
    datePublished: '2025-01-15',
    dateModified: '2025-01-18',
    category: 'Fashion Trends',
    keyFacts: [
      'Bold colors are trending for spring 2025',
      'Sustainable fashion is a major focus',
      'Mix of vintage and modern styles',
    ],
  },
  {
    id: 2,
    title: 'Sustainable Fashion: How to Build an Eco-Friendly Wardrobe',
    excerpt: 'Learn how to make sustainable fashion choices and build an eco-friendly wardrobe that\'s both stylish and responsible.',
    author: {
      name: 'Michael Chen',
      title: 'Sustainability Expert',
      credentials: 'Environmental Science PhD, Sustainable Fashion Consultant',
      organization: 'THE STORE',
      expertise: ['Sustainable Fashion', 'Environmental Impact', 'Ethical Sourcing'],
      linkedIn: 'https://www.linkedin.com/in/michaelchen',
      email: 'michael@thestore.com',
    },
    datePublished: '2025-01-10',
    dateModified: '2025-01-12',
    category: 'Sustainability',
    keyFacts: [
      'Choose organic and recycled materials',
      'Buy quality items that last longer',
      'Support ethical and sustainable brands',
    ],
  },
  {
    id: 3,
    title: 'Winter Style Guide: Staying Warm and Fashionable',
    excerpt: 'Master the art of winter dressing with our comprehensive style guide. Stay warm without sacrificing your style.',
    author: {
      name: 'Emily Rodriguez',
      title: 'Style Consultant',
      credentials: 'Certified Personal Stylist, Fashion Institute Graduate',
      organization: 'THE STORE',
      expertise: ['Seasonal Styling', 'Wardrobe Planning', 'Color Coordination'],
      linkedIn: 'https://www.linkedin.com/in/emilyrodriguez',
      email: 'emily@thestore.com',
    },
    datePublished: '2025-01-05',
    dateModified: '2025-01-08',
    category: 'Style Guide',
    keyFacts: [
      'Layer clothing for warmth and style',
      'Choose quality winter fabrics',
      'Accessorize with scarves and gloves',
    ],
  },
  {
    id: 4,
    title: 'The Ultimate Shoe Care Guide: Keep Your Footwear Looking New',
    excerpt: 'Learn professional tips and tricks to maintain and care for your shoes, extending their lifespan and keeping them looking great.',
    author: {
      name: 'David Park',
      title: 'Product Care Specialist',
      credentials: 'Leather Care Expert, 15+ years in footwear industry',
      organization: 'THE STORE',
      expertise: ['Product Care', 'Shoe Maintenance', 'Material Science'],
      linkedIn: 'https://www.linkedin.com/in/davidpark',
      email: 'david@thestore.com',
    },
    datePublished: '2024-12-28',
    dateModified: '2025-01-02',
    category: 'Care Guide',
    keyFacts: [
      'Clean shoes regularly with appropriate products',
      'Store shoes properly to maintain shape',
      'Use shoe trees for leather shoes',
    ],
  },
];

export default function BlogPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';

  // Example correction note (in production, this would come from a database)
  const hasCorrection = false; // Set to true to show example correction
  const correction = {
    text: 'Updated pricing information for sustainable fashion products to reflect current market rates.',
    datePublished: '2025-01-20',
    url: `${baseUrl}/blog`,
  };

  return (
    <main className="min-h-screen p-8 bg-white" role="main" aria-label="Blog and News page">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Blog & News</h1>
        {hasCorrection && (
          <CorrectionNote
            text={correction.text}
            datePublished={correction.datePublished}
            url={correction.url}
            position="top"
          />
        )}
        <p className="text-stone-600 mb-8">
          Stay updated with the latest fashion trends, style tips, and news from THE STORE.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => {
            const articleSchema: Record<string, unknown> = {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.excerpt,
              datePublished: post.datePublished,
              dateModified: post.dateModified,
              author: {
                '@type': 'Person',
                name: post.author.name,
                jobTitle: post.author.title,
                credential: post.author.credentials || undefined,
                worksFor: {
                  '@type': 'Organization',
                  name: post.author.organization,
                },
                knowsAbout: post.author.expertise,
                sameAs: post.author.linkedIn ? [post.author.linkedIn] : [],
                email: post.author.email,
              },
              publisher: {
                '@type': 'Organization',
                name: 'THE STORE',
                logo: {
                  '@type': 'ImageObject',
                  url: `${baseUrl}/cover.webp`,
                },
              },
              articleSection: post.category,
              url: `${baseUrl}/blog/${post.id}`,
            };

            // Add key facts to article schema if available
            if (post.keyFacts && post.keyFacts.length > 0) {
              articleSchema.about = {
                '@type': 'ItemList',
                itemListElement: post.keyFacts.map((fact, idx) => ({
                  '@type': 'ListItem',
                  position: idx + 1,
                  name: fact,
                })),
              };
            }

            return (
              <article
                key={post.id}
                className="border border-stone-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                itemScope
                itemType="https://schema.org/Article"
              >
                <StructuredData data={articleSchema} id={`article-${post.id}-schema`} />
                <div className="mb-3 text-sm text-stone-500">
                  <time dateTime={post.datePublished} itemProp="datePublished">
                    {new Date(post.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  {post.dateModified !== post.datePublished && (
                    <>
                      <span className="mx-2">•</span>
                      <time dateTime={post.dateModified} itemProp="dateModified">
                        Updated {new Date(post.dateModified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </time>
                    </>
                  )}
                </div>
                <h2 id={generateHeadingId(post.title)} className="text-xl font-semibold mb-2" itemProp="headline">
                  <Link href={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-stone-600 mb-4" itemProp="description">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-stone-500">
                      <span className="font-medium">By</span>{' '}
                      <span itemProp="author" itemScope itemType="https://schema.org/Person">
                        <span itemProp="name">{post.author.name}</span>
                        {post.author.credentials && (
                          <span className="text-stone-400">, {post.author.credentials}</span>
                        )}
                        {post.author.title && (
                          <span className="text-stone-400"> - {post.author.title}</span>
                        )}
                      </span>
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-stone-100 rounded-full text-stone-700 text-xs">
                    {post.category}
                  </span>
                </div>
                {post.keyFacts && post.keyFacts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-200">
                    <p className="text-xs font-semibold text-stone-600 mb-2">Key Facts:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-stone-600">
                      {post.keyFacts.map((fact, idx) => (
                        <li key={idx}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

