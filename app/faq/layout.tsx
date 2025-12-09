import { generateFAQSchema, generateStructuredData } from '@/lib/seo';

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

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  const faqSchema = generateFAQSchema(faqData, publishedDate, modifiedDate, author);

  // Generate ImageObject schema for FAQ page
  const faqImageSchema = generateStructuredData('ImageObject', {
    contentUrl: `${baseUrl}/cover.webp`,
    url: `${baseUrl}/cover.webp`,
    caption: 'Frequently Asked Questions - THE STORE',
    description: 'Find answers to common questions about THE STORE. Learn about shipping, returns, payments, sizing, and more. Get help with your shopping experience.',
    width: 1200,
    height: 630,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqImageSchema),
        }}
      />
      {children}
    </>
  );
}

