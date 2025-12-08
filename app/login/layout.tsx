import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Login',
  description: 'Log into your THE STORE account to access your orders, favorites, and personalized shopping experience.',
  keywords: 'login, sign in, account, THE STORE',
  url: '/login',
  noindex: true, // Login pages should not be indexed
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

