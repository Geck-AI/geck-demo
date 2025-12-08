import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, generateStructuredData } from '@/lib/seo';
import Script from 'next/script';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Create Account',
  description: 'Sign up for a new account at THE STORE. Create your profile to start shopping and save your favorite items.',
  keywords: 'register, sign up, create account, new user, registration',
  url: '/register',
});

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  
  const signUpAction = generateStructuredData('SignUpAction', {
    targetUrl: `${baseUrl}/api/auth/register`,
  });

  return (
    <>
      <Script
        id="signup-action-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(signUpAction),
        }}
      />
      {children}
    </>
  );
}

