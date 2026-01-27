import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'My Favorites',
  description: 'View your favorite products at THE STORE. Save items you love for later.',
  keywords: 'favorites, wishlist, saved items, THE STORE',
  url: '/favorites',
});

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

