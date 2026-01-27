import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, generateArticleSchema, generateStructuredData } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Blog & News',
  description: 'Stay updated with the latest fashion trends, style tips, and news from THE STORE.',
  keywords: 'blog, news, fashion, style, trends, THE STORE',
  url: '/blog',
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  
  // Generate Article schema for the blog page itself
  const blogPageSchema = generateArticleSchema({
    headline: 'Blog & News - THE STORE',
    description: 'Stay updated with the latest fashion trends, style tips, and news from THE STORE.',
    author: {
      name: 'THE STORE Editorial Team',
      title: 'Editorial Team',
      organization: 'THE STORE',
      expertise: ['Fashion', 'Style', 'Trends'],
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    url: `${baseUrl}/blog`,
    publisher: {
      name: 'THE STORE',
      logo: `${baseUrl}/cover.webp`,
    },
  });

  // Generate ImageObject schema for blog page
  const blogImageSchema = generateStructuredData('ImageObject', {
    contentUrl: `${baseUrl}/cover.webp`,
    url: `${baseUrl}/cover.webp`,
    caption: 'Blog & News - THE STORE',
    description: 'Stay updated with the latest fashion trends, style tips, and news from THE STORE. Read articles about fashion, sustainability, style guides, and more.',
    width: 1200,
    height: 630,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogImageSchema),
        }}
      />
      {children}
    </>
  );
}

