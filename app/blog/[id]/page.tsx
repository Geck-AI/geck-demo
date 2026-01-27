import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateMetadata as generateSEOMetadata, generateArticleSchema, generateStructuredData } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import Link from 'next/link';
import { getBlogPostById } from '@/lib/blogData';
import CorrectionNote from '@/components/CorrectionNote';

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const postId = parseInt(id);
  const post = getBlogPostById(postId);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt,
    keywords: `blog, ${post.category.toLowerCase()}, fashion, style, THE STORE`,
    url: `/blog/${post.id}`,
    type: 'article',
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const postId = parseInt(id);
  const post = getBlogPostById(postId);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';

  // Example correction note (in production, this would come from a database)
  // Enable correction note for the first blog post to demonstrate the feature
  const hasCorrection = post.id === 1;
  const correction = {
    text: 'Updated information to reflect the latest fashion trends and sustainable practices. This article was corrected to include more accurate data about sustainable fashion materials.',
    datePublished: '2025-01-20',
    url: `${baseUrl}/blog/${post.id}`,
  };

  // Generate article schema
  const articleSchema = generateArticleSchema({
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
  });

  // Generate Organization schema
  const organizationSchema = generateStructuredData('Organization');

  return (
    <>
      <StructuredData data={organizationSchema} id="organization-schema" />
      <StructuredData data={articleSchema} id={`article-${post.id}-schema`} />
      <main className="min-h-screen p-8 bg-white" role="main" aria-label={`Blog post: ${post.title}`}>
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/blog" 
            className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
          >
            ← Back to Blog
          </Link>

          <article itemScope itemType="https://schema.org/Article">
            <div className="mb-4 text-sm text-stone-500">
              <time dateTime={post.datePublished} itemProp="datePublished">
                {new Date(post.datePublished).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
              {post.dateModified !== post.datePublished && (
                <>
                  <span className="mx-2">•</span>
                  <time dateTime={post.dateModified} itemProp="dateModified">
                    Updated {new Date(post.dateModified).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                </>
              )}
            </div>

            {hasCorrection && (
              <CorrectionNote
                text={correction.text}
                datePublished={correction.datePublished}
                url={correction.url}
                position="top"
              />
            )}

            <h1 className="text-4xl font-bold mb-4" itemProp="headline">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-6 text-sm">
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

            <div className="prose prose-stone max-w-none mb-8" itemProp="description">
              <p className="text-xl text-stone-600 mb-6">{post.excerpt}</p>
              
              {post.content && (
                <div className="text-stone-700 whitespace-pre-line">
                  {post.content.split('\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={idx} className="text-2xl font-semibold mt-8 mb-4">
                          {paragraph.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (paragraph.trim() === '') {
                      return <br key={idx} />;
                    }
                    return (
                      <p key={idx} className="mb-4">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            {post.keyFacts && post.keyFacts.length > 0 && (
              <div className="mt-8 pt-6 border-t border-stone-200">
                <h2 className="text-xl font-semibold text-stone-800 mb-4">Key Facts</h2>
                <ul className="list-disc list-inside space-y-2 text-stone-600">
                  {post.keyFacts.map((fact, idx) => (
                    <li key={idx}>{fact}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-stone-200">
              <Link 
                href="/blog" 
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to all blog posts
              </Link>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}

