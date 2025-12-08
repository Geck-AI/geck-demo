import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, generateFAQSchema, generateAuthorSchema } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import { generateHeadingId } from '@/lib/utils';
import TableOfContents from '@/components/TableOfContents';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about THE STORE. Learn about shipping, returns, payments, sizing, and more.',
  keywords: 'FAQ, frequently asked questions, help, support, shipping, returns, payments, sizing',
  url: '/faq',
});

const faqData = [
  {
    question: 'What is your shipping policy?',
    answer: 'We offer free standard shipping on orders over $50. Standard shipping takes 5-7 business days. Express shipping is available at checkout.',
    isBestAnswer: true,
    keyFacts: [
      'Free standard shipping on orders over $50',
      'Standard shipping: 5-7 business days',
      'Express shipping available at checkout',
    ],
  },
  {
    question: 'How do I return or exchange an item?',
    answer: 'You can return or exchange items within 30 days of purchase. Items must be unworn, unwashed, and in original packaging with tags attached. Visit our Returns page to initiate a return.',
    isBestAnswer: true,
    keyFacts: [
      '30-day return window',
      'Items must be unworn, unwashed, in original packaging',
      'Tags must be attached',
    ],
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. All payments are processed securely.',
    isBestAnswer: true,
    keyFacts: [
      'Accepts Visa, Mastercard, American Express',
      'Accepts PayPal, Apple Pay, Google Pay',
      'All payments processed securely',
    ],
  },
  {
    question: 'How do I track my order?',
    answer: 'You receive a tracking number via email when your order ships. You can also track orders in your account Order History section.',
    keyFacts: [
      'Tracking number sent via email',
      'Track orders in account Order History',
    ],
  },
  {
    question: 'What is your size guide?',
    answer: 'We provide detailed size charts for each product category. Size charts are on product pages and in our Size Guide section. Contact customer service for help finding the right size.',
    keyFacts: [
      'Size charts available for each product category',
      'Size charts on product pages',
      'Size Guide section available',
    ],
  },
  {
    question: 'Do you ship internationally?',
    answer: 'We ship to the United States, Canada, and select international destinations. Shipping costs and delivery times vary by location. Check our Shipping page for details.',
    keyFacts: [
      'Ships to United States and Canada',
      'Ships to select international destinations',
      'Shipping costs vary by location',
    ],
  },
  {
    question: 'How do I care for my items?',
    answer: 'Care instructions are on each product label and in product descriptions. Follow the care label instructions for best results.',
    keyFacts: [
      'Care instructions on product labels',
      'Care instructions in product descriptions',
    ],
  },
  {
    question: 'Can I cancel or modify my order?',
    answer: 'You can cancel or modify your order within 1 hour of placing it. After 1 hour, orders are processed and cannot be changed. Contact customer service immediately if you need changes.',
    keyFacts: [
      '1-hour cancellation window',
      'Orders cannot be changed after 1 hour',
    ],
  },
  {
    question: 'Do you offer gift wrapping?',
    answer: 'Yes, we offer gift wrapping for an additional fee. Select this option during checkout. Gift messages can be included.',
    keyFacts: [
      'Gift wrapping available for additional fee',
      'Select during checkout',
      'Gift messages can be included',
    ],
  },
  {
    question: 'What is your privacy policy?',
    answer: 'We protect your privacy. We only collect necessary information to process orders and improve your shopping experience. Read our full Privacy Policy for details.',
    keyFacts: [
      'Privacy protection commitment',
      'Only collect necessary information',
    ],
  },
  {
    question: 'How do I create an account?',
    answer: 'Click the "Register" or "Create Account" button in the top navigation. Fill in your information and verify your email address. You can also check out as a guest without creating an account.',
    keyFacts: [
      'Register via top navigation',
      'Email verification required',
      'Guest checkout available',
    ],
  },
  {
    question: 'What if my item is damaged or defective?',
    answer: 'Contact our customer service team within 7 days of delivery if you receive a damaged or defective item. We will arrange a replacement or full refund at no cost to you.',
    isBestAnswer: true,
    keyFacts: [
      '7-day window to report damage',
      'Replacement or full refund available',
      'No cost to customer',
    ],
  },
  {
    question: 'Do you have physical stores?',
    answer: 'We operate as an online-only retailer. We have plans to open physical locations in select cities. Sign up for our newsletter to be notified of store openings.',
    keyFacts: [
      'Online-only retailer',
      'Plans to open physical locations',
    ],
  },
  {
    question: 'How do I apply a discount code?',
    answer: 'Enter your discount code in the "Promo Code" field during checkout. Click "Apply" to see the discount in your order total. Codes are case-sensitive.',
    keyFacts: [
      'Enter code in Promo Code field',
      'Codes are case-sensitive',
    ],
  },
  {
    question: 'What is your return shipping policy?',
    answer: 'Return shipping is free for items returned within 30 days. We provide a prepaid return label. Print the label from your order confirmation email or account dashboard.',
    keyFacts: [
      'Free return shipping within 30 days',
      'Prepaid return label provided',
    ],
  },
  {
    question: 'Can I save items to a wishlist?',
    answer: 'Yes, you can save items to your favorites by clicking the heart icon on any product. You must be logged in to use this feature. Access your favorites from the account menu.',
    keyFacts: [
      'Save items via heart icon',
      'Login required',
      'Access from account menu',
    ],
  },
  {
    question: 'How do I contact customer service?',
    answer: 'Contact customer service via email at support@thestore.com, phone at 1-800-THE-STORE, or through the contact form on our website. We respond within 24 hours.',
    isBestAnswer: true,
    keyFacts: [
      'Email: support@thestore.com',
      'Phone: 1-800-THE-STORE',
      '24-hour response time',
    ],
  },
  {
    question: 'What is your exchange policy?',
    answer: 'Exchanges are available for items in new condition within 30 days of purchase. If the item you want is in stock, we can process an exchange. Otherwise, return for a refund and place a new order.',
    keyFacts: [
      '30-day exchange window',
      'Items must be in new condition',
      'Exchange depends on item availability',
    ],
  },
  {
    question: 'Do you offer student discounts?',
    answer: 'Yes, we offer a 10% student discount. Students can verify their status through our student discount program. Visit our Student Discount page for more information and to apply.',
    keyFacts: [
      '10% student discount available',
      'Status verification required',
    ],
  },
];

export default function FAQPage() {
  const publishedDate = '2024-01-15';
  const modifiedDate = new Date().toISOString().split('T')[0];
  
  const author = {
    name: 'Sarah Martinez',
    title: 'Customer Support Specialist',
    credentials: 'Certified E-commerce Customer Service Professional',
    organization: 'THE STORE',
    expertise: ['Customer Service', 'E-commerce', 'Fashion Retail', 'Order Management'],
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@thestore.com',
  };

  const faqSchema = generateFAQSchema(faqData, publishedDate, modifiedDate, author);
  const authorSchema = generateAuthorSchema(author);

  // Generate table of contents from FAQ questions
  const tocHeadings = faqData.map((faq) => ({
    text: faq.question,
    level: 2,
  }));

  return (
    <main className="min-h-screen p-8 bg-white" role="main" aria-label="Frequently Asked Questions page">
      <StructuredData data={faqSchema} id="faq-schema" />
      <StructuredData data={authorSchema} id="author-schema" />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <aside className="lg:col-span-1">
            <TableOfContents headings={tocHeadings} />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <div className="flex items-center gap-4 text-sm text-stone-600 mb-4">
          <p>
            <span className="font-medium">Published:</span>{' '}
            <time dateTime={publishedDate}>
              {new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </p>
          <span aria-hidden="true">•</span>
          <p>
            <span className="font-medium">Last Updated:</span>{' '}
            <time dateTime={modifiedDate}>
              {new Date(modifiedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </p>
        </div>
        <div className="mb-6 text-sm text-stone-600">
          <p>
            <span className="font-medium">Author:</span> {author.name}, {author.credentials} - {author.title} at {author.organization}
          </p>
          <p className="mt-1">
            <span className="font-medium">Last Updated:</span>{' '}
            <time dateTime={modifiedDate}>
              {new Date(modifiedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </p>
        </div>
        <p className="text-stone-600 mb-8">
          Find answers to common questions about shopping at THE STORE.
        </p>

        <div className="space-y-6">
          {faqData.map((faq, index) => {
            const headingId = generateHeadingId(faq.question);
            return (
              <article
                key={index}
                className={`border-b border-stone-200 pb-6 last:border-b-0 ${faq.isBestAnswer ? 'bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400' : ''}`}
                itemScope
                itemType="https://schema.org/Question"
              >
                <div className="flex items-start gap-2 mb-2">
                  <h2 id={headingId} className="text-xl font-semibold flex-1" itemProp="name">
                    {faq.question}
                  </h2>
                  {faq.isBestAnswer && (
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded whitespace-nowrap" title="Best answer snippet candidate">
                      Best Answer
                    </span>
                  )}
                </div>
                <div
                  className="text-stone-700"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <p className="mb-3" itemProp="text">{faq.answer}</p>
                  {faq.keyFacts && faq.keyFacts.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm text-stone-600 mt-3" itemProp="suggestedAnswer">
                      {faq.keyFacts.map((fact, factIdx) => (
                        <li key={factIdx} itemProp="text">{fact}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
          </div>
        </div>
      </div>
    </main>
  );
}

