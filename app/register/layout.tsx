import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, generateStructuredData } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';

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
  
  // Generate SignUpAction schema using the shared function
  const signUpActionSchema = generateStructuredData('SignUpAction', {
    targetUrl: `${baseUrl}/api/auth/register`,
  });

  return (
    <>
      <StructuredData data={signUpActionSchema} id="signup-action-schema" />
      {children}
    </>
  );
}

