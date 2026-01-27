import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Content Policy & AI Usage',
  description: 'Learn about how THE STORE content can be used for AI training and machine learning. Our content licensing policy and AI usage guidelines.',
  keywords: 'content policy, AI usage, licensing, CC-BY-4.0, machine learning, AI training',
  url: '/content-policy',
});

export default function ContentPolicyPage() {
  const tocHeadings = [
    { text: 'License Declaration', level: 2 },
    { text: 'AI Training Permissions', level: 2 },
    { text: 'ALLOWED', level: 3 },
    { text: 'NOT ALLOWED', level: 3 },
    { text: 'Attribution Requirements', level: 2 },
    { text: 'Usage Rights', level: 2 },
    { text: 'Commercial Use', level: 3 },
    { text: 'Modification', level: 3 },
    { text: 'Distribution', level: 3 },
    { text: 'Machine-Readable Policy', level: 2 },
    { text: 'Questions or Concerns?', level: 2 },
    { text: 'Related Policies', level: 2 },
  ];

  return (
    <main className="min-h-screen p-8 bg-white" role="main" aria-label="Content Policy and AI Usage page">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <aside className="lg:col-span-1">
            <TableOfContents headings={tocHeadings} />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold mb-4">Content Policy & AI Usage</h1>
            <div className="mb-6 text-sm text-stone-600">
              <p>
                <span className="font-medium">Last Updated:</span>{' '}
                <time dateTime={new Date().toISOString().split('T')[0]}>
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </p>
            </div>
        <p className="text-stone-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8" aria-labelledby="license-heading">
          <h2 id="license-heading" className="text-2xl font-semibold mb-4">License Declaration</h2>
          <div className="bg-stone-50 p-6 rounded-md mb-4">
            <p className="mb-2">
              <strong>License Type:</strong> Creative Commons Attribution 4.0 International (CC-BY-4.0)
            </p>
            <p className="mb-2">
              <strong>License URL:</strong>{' '}
              <a 
                href="https://creativecommons.org/licenses/by/4.0/" 
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View CC-BY-4.0 license details"
              >
                https://creativecommons.org/licenses/by/4.0/
              </a>
            </p>
            <p>
              <strong>Copyright:</strong> © {new Date().getFullYear()} THE STORE. All rights reserved.
            </p>
          </div>
        </section>

        <section className="mb-8" aria-labelledby="ai-training-heading">
          <h2 id="ai-training-heading" className="text-2xl font-semibold mb-4">AI Training Permissions</h2>
          
          <div className="mb-6">
            <h3 id="allowed" className="text-xl font-semibold mb-3 text-green-700">✅ ALLOWED</h3>
            <ul className="list-disc list-inside space-y-2 text-stone-700">
              <li>Training AI models, including large language models (LLMs)</li>
              <li>Machine learning and deep learning applications</li>
              <li>Natural language processing research</li>
              <li>Content analysis and indexing by AI systems</li>
              <li>Commercial use of trained models</li>
              <li>Modification and adaptation of content</li>
              <li>Distribution of content in AI training datasets</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 id="not-allowed" className="text-xl font-semibold mb-3 text-red-700">❌ NOT ALLOWED</h3>
            <ul className="list-disc list-inside space-y-2 text-stone-700">
              <li>Removing attribution or copyright notices</li>
              <li>Using content in a way that violates applicable laws</li>
              <li>Using content to create competing e-commerce platforms</li>
              <li>Scraping user-generated content (reviews, comments) without permission</li>
            </ul>
          </div>
        </section>

        <section className="mb-8" aria-labelledby="attribution-heading">
          <h2 id="attribution-heading" className="text-2xl font-semibold mb-4">Attribution Requirements</h2>
          <p className="text-stone-700 mb-4">
            When using THE STORE content for AI training, you must provide attribution in the following format:
          </p>
          <div className="bg-stone-50 p-4 rounded-md font-mono text-sm">
            Content from THE STORE (https://www.yourdomain.com)
          </div>
        </section>

        <section className="mb-8" aria-labelledby="usage-rights-heading">
          <h2 id="usage-rights-heading" className="text-2xl font-semibold mb-4">Usage Rights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-stone-200 p-4 rounded-md">
              <h3 id="commercial-use" className="font-semibold mb-2">Commercial Use</h3>
              <p className="text-green-700 font-bold">ALLOWED</p>
            </div>
            <div className="border border-stone-200 p-4 rounded-md">
              <h3 id="modification" className="font-semibold mb-2">Modification</h3>
              <p className="text-green-700 font-bold">ALLOWED</p>
            </div>
            <div className="border border-stone-200 p-4 rounded-md">
              <h3 id="distribution" className="font-semibold mb-2">Distribution</h3>
              <p className="text-green-700 font-bold">ALLOWED</p>
            </div>
          </div>
        </section>

        <section className="mb-8" aria-labelledby="llms-txt-heading">
          <h2 id="llms-txt-heading" className="text-2xl font-semibold mb-4">Machine-Readable Policy</h2>
          <p className="text-stone-700 mb-4">
            For AI systems and crawlers, we provide a machine-readable policy file:
          </p>
          <div className="bg-stone-50 p-4 rounded-md">
            <p className="font-mono text-sm mb-2">
              <strong>File Location:</strong> <a 
                href="/llms.txt" 
                className="text-blue-600 hover:underline"
                aria-label="View llms.txt file"
              >
                /llms.txt
              </a>
            </p>
            <p className="text-sm text-stone-600">
              This file contains structured information about our content licensing and AI usage policy in a format that AI systems can easily parse.
            </p>
          </div>
        </section>

        <section className="mb-8" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="text-2xl font-semibold mb-4">Questions or Concerns?</h2>
          <p className="text-stone-700 mb-4">
            If you have questions about our content policy or AI usage guidelines, please contact us:
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
          <h2 id="related-heading" className="text-2xl font-semibold mb-4">Related Policies</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-blue-600 hover:underline">
                Frequently Asked Questions
              </Link>
            </li>
          </ul>
        </section>
          </div>
        </div>
      </div>
    </main>
  );
}

