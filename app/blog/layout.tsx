import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

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
  return <>{children}</>;
}

