import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Order Success',
  description: 'Your order has been placed successfully at THE STORE.',
  keywords: 'order, success, confirmation, THE STORE',
  url: '/order-success',
  noindex: true, // Order success pages should not be indexed
});

export default function OrderSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

