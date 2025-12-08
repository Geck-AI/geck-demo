import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Search Products',
  description: 'Search for products, categories, and brands at THE STORE. Find exactly what you\'re looking for.',
  keywords: 'search, products, find, browse, THE STORE',
  url: '/search',
});

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

