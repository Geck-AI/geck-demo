import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, generateStructuredData } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Submit Feedback or Correction',
  description: 'Help us maintain accurate information by reporting errors or suggesting improvements. Submit corrections and feedback through our dedicated form.',
  keywords: 'feedback, correction, report error, submit correction, feedback form',
  url: '/feedback',
});

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  
  // Generate CorrectionComment schema for the feedback form page
  const correctionCommentSchema = generateStructuredData('CorrectionComment', {
    text: 'This page allows users to submit corrections and feedback. Use the form below to report errors or suggest improvements.',
    datePublished: new Date().toISOString(),
    url: `${baseUrl}/feedback`,
    parentItem: {
      '@type': 'WebPage',
      url: `${baseUrl}/feedback`,
      name: 'Feedback and Corrections Submission Page',
    },
  });

  return (
    <>
      <StructuredData data={correctionCommentSchema} id="feedback-correction-schema" />
      {children}
    </>
  );
}

