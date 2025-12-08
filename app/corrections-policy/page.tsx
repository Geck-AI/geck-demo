import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Corrections Policy',
  description: 'Learn about THE STORE\'s corrections policy. Submit corrections, report errors, and help us maintain accurate information.',
  keywords: 'corrections, feedback, errors, accuracy, corrections policy, report error',
  url: '/corrections-policy',
});

export default function CorrectionsPolicyPage() {
  return (
    <main className="min-h-screen p-8 bg-white" role="main" aria-label="Corrections Policy page">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Corrections Policy</h1>
        <p className="text-stone-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-stone-700 mb-4">
            At THE STORE, we are committed to providing accurate and up-to-date information. We recognize that errors can occur, and we welcome feedback to help us maintain the highest standards of accuracy.
          </p>
          <p className="text-stone-700 mb-4">
            This policy outlines how we handle corrections, updates, and feedback from our users and the public.
          </p>
        </section>

        <section className="mb-8" aria-labelledby="what-heading">
          <h2 id="what-heading" className="text-2xl font-semibold mb-4">What Can Be Corrected</h2>
          <ul className="list-disc list-inside space-y-2 text-stone-700 mb-4">
            <li>Product information (names, descriptions, prices, specifications)</li>
            <li>Factual errors in blog posts, guides, or articles</li>
            <li>Incorrect contact information or business details</li>
            <li>Broken links or outdated URLs</li>
            <li>Spelling or grammatical errors in published content</li>
            <li>Inaccurate product images or media</li>
          </ul>
        </section>

        <section className="mb-8" aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-2xl font-semibold mb-4">How to Submit a Correction</h2>
          <div className="bg-stone-50 p-6 rounded-md mb-4">
            <h3 className="text-xl font-semibold mb-3">Option 1: Use Our Feedback Form</h3>
            <p className="text-stone-700 mb-4">
              The easiest way to submit a correction is through our{' '}
              <Link href="/feedback" className="text-blue-600 hover:underline">
                feedback form
              </Link>
              . Please include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-700 mb-4 ml-4">
              <li>The URL or page where the error appears</li>
              <li>A clear description of the error</li>
              <li>The correct information (if known)</li>
              <li>Your contact information (optional, for follow-up)</li>
            </ul>
          </div>

          <div className="bg-stone-50 p-6 rounded-md mb-4">
            <h3 className="text-xl font-semibold mb-3">Option 2: Email Us</h3>
            <p className="text-stone-700 mb-2">
              Send an email to:{' '}
              <a 
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@thestore.com'}?subject=Correction Request`}
                className="text-blue-600 hover:underline"
                aria-label="Send email to support for corrections"
              >
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@thestore.com'}
              </a>
            </p>
            <p className="text-stone-600 text-sm">
              Please include &quot;Correction Request&quot; in the subject line.
            </p>
          </div>

          <div className="bg-stone-50 p-6 rounded-md mb-4">
            <h3 className="text-xl font-semibold mb-3">Option 3: API Endpoint</h3>
            <p className="text-stone-700 mb-2">
              For automated systems, you can submit corrections via our API:
            </p>
            <code className="block bg-stone-800 text-stone-100 p-3 rounded text-sm mb-2">
              POST /api/feedback/corrections
            </code>
            <p className="text-stone-600 text-sm">
              See our{' '}
              <Link href="/api/docs" className="text-blue-600 hover:underline">
                API documentation
              </Link>
              {' '}for details.
            </p>
          </div>
        </section>

        <section className="mb-8" aria-labelledby="process-heading">
          <h2 id="process-heading" className="text-2xl font-semibold mb-4">Our Correction Process</h2>
          <ol className="list-decimal list-inside space-y-3 text-stone-700 mb-4">
            <li>
              <strong>Review:</strong> We review all correction requests within 2-3 business days.
            </li>
            <li>
              <strong>Verification:</strong> We verify the reported error and gather the correct information.
            </li>
            <li>
              <strong>Correction:</strong> Once verified, we update the content as quickly as possible.
            </li>
            <li>
              <strong>Notification:</strong> For significant corrections, we may add a visible correction note to the page.
            </li>
            <li>
              <strong>Follow-up:</strong> If you provided contact information, we may follow up to confirm the correction.
            </li>
          </ol>
        </section>

        <section className="mb-8" aria-labelledby="display-heading">
          <h2 id="display-heading" className="text-2xl font-semibold mb-4">How Corrections Are Displayed</h2>
          <p className="text-stone-700 mb-4">
            When we make significant corrections to published content, we may display a correction note on the page. This note will:
          </p>
          <ul className="list-disc list-inside space-y-2 text-stone-700 mb-4">
            <li>Appear prominently at the top or bottom of the corrected content</li>
            <li>Include the date of the correction</li>
            <li>Briefly describe what was corrected</li>
            <li>Follow schema.org CorrectionComment markup for machine readability</li>
          </ul>
        </section>

        <section className="mb-8" aria-labelledby="response-heading">
          <h2 id="response-heading" className="text-2xl font-semibold mb-4">Response Times</h2>
          <ul className="list-disc list-inside space-y-2 text-stone-700 mb-4">
            <li><strong>Urgent errors</strong> (safety, legal, pricing): Within 24 hours</li>
            <li><strong>Product information errors:</strong> Within 2-3 business days</li>
            <li><strong>Content errors:</strong> Within 5-7 business days</li>
            <li><strong>Minor typos:</strong> Within 1-2 weeks</li>
          </ul>
        </section>

        <section className="mb-8" aria-labelledby="privacy-heading">
          <h2 id="privacy-heading" className="text-2xl font-semibold mb-4">Privacy & Attribution</h2>
          <p className="text-stone-700 mb-4">
            We respect your privacy. You can submit corrections anonymously if you prefer. If you choose to provide contact information, we will only use it to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-stone-700 mb-4">
            <li>Follow up on your correction request</li>
            <li>Thank you for your contribution (with your permission)</li>
            <li>Ask for clarification if needed</li>
          </ul>
          <p className="text-stone-700 mb-4">
            We will not share your contact information with third parties or use it for marketing purposes.
          </p>
        </section>

        <section className="mb-8 border-t border-stone-200 pt-8" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="text-2xl font-semibold mb-4">Questions?</h2>
          <p className="text-stone-700 mb-4">
            If you have questions about our corrections policy or need help submitting a correction, please contact us:
          </p>
          <ul className="list-none space-y-2">
            <li>
              <strong>Email:</strong>{' '}
              <a 
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@thestore.com'}`}
                className="text-blue-600 hover:underline"
                aria-label="Send email to support"
              >
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@thestore.com'}
              </a>
            </li>
            <li>
              <strong>Phone:</strong>{' '}
              <a 
                href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1-800-THE-STORE'}`}
                className="text-blue-600 hover:underline"
                aria-label="Call support"
              >
                {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1-800-THE-STORE'}
              </a>
            </li>
          </ul>
        </section>

        <section className="border-t border-stone-200 pt-8" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-semibold mb-4">Related Pages</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <Link href="/feedback" className="text-blue-600 hover:underline">
                Submit Feedback or Correction
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-blue-600 hover:underline">
                Frequently Asked Questions
              </Link>
            </li>
            <li>
              <Link href="/content-policy" className="text-blue-600 hover:underline">
                Content Policy & AI Usage
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}

