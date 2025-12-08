import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Shopping Cart',
  description: 'Review your shopping cart items at THE STORE. Proceed to checkout when ready.',
  keywords: 'cart, shopping cart, checkout, THE STORE',
  url: '/cart',
  noindex: true, // Cart pages should not be indexed
});

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

