import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, generateArticleSchema, generateStructuredData } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import Link from 'next/link';
import { generateHeadingId } from '@/lib/utils';
import CorrectionNote from '@/components/CorrectionNote';
import { getAllBlogPosts } from '@/lib/blogData';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Blog & News',
  description: 'Stay updated with the latest fashion trends, style tips, and news from THE STORE.',
  keywords: 'blog, news, fashion, style, trends, THE STORE',
  url: '/blog',
});

const blogPosts = getAllBlogPosts();

export default function BlogPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';

  // Example correction note (in production, this would come from a database)
  // Enable correction note on the blog listing page to demonstrate the feature
  const hasCorrection = true; // Set to true to show example correction
  const correction = {
    text: 'Updated pricing information for sustainable fashion products to reflect current market rates. This correction was made to ensure accurate pricing data for our readers.',
    datePublished: '2025-01-20',
    url: `${baseUrl}/blog`,
  };

  // Generate Organization schema
  const organizationSchema = generateStructuredData('Organization');

  // Generate all article schemas at the top
  const articleSchemas = blogPosts.map((post) => 
    generateArticleSchema({
      headline: post.title,
      description: post.excerpt,
      author: post.author,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      url: `${baseUrl}/blog/${post.id}`,
      articleSection: post.category,
      publisher: {
        name: 'THE STORE',
        logo: `${baseUrl}/cover.webp`,
      },
      keyFacts: post.keyFacts,
    })
  );

  return (
    <>
      {/* JSON-LD structured data at top of body */}
      <StructuredData data={organizationSchema} id="organization-schema" />
      {articleSchemas.map((schema, index) => (
        <StructuredData key={`article-schema-${blogPosts[index].id}`} data={schema} id={`article-${blogPosts[index].id}-schema`} />
      ))}
      <main className="min-h-screen p-8 bg-white" role="main" aria-label="Blog and News page">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Blog & News</h1>
          <div className="text-sm text-stone-500 mb-4">
            <time dateTime="2024-01-01">Published: January 1, 2024</time>
            <span className="mx-2">•</span>
            <time dateTime={new Date().toISOString().split('T')[0]}>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
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
            return (
              <article
                key={post.id}
                className="border border-stone-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                itemScope
                itemType="https://schema.org/Article"
              >
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
    </>
  );
}

