"use client";

import Link from "next/link";

const footerSections = [
  {
    title: "Shop",
    links: [
      { title: "Just In", path: "/shop/just-in" },
      { title: "Clothes", path: "/shop/clothes" },
      { title: "Shoes", path: "/shop/shoes" },
      { title: "Accessories", path: "/shop/accessories" },
      { title: "Offers", path: "/shop/offers" },
    ],
  },
  {
    title: "Help",
    links: [
      { title: "Contact Us", path: "/contact" },
      { title: "Delivery Information", path: "/faq#shipping" },
      { title: "Returns & Exchanges", path: "/faq#returns" },
      { title: "Payment Options", path: "/faq#payments" },
      { title: "Size Guide", path: "/faq#sizing" },
      { title: "Order Tracking", path: "/faq#tracking" },
      { title: "Submit Feedback", path: "/feedback" },
      { title: "Corrections Policy", path: "/corrections-policy" },
      { title: "API Documentation", path: "/api/docs" },
      { title: "API Keys", path: "/api-keys" },
    ],
  },
  {
    title: "Account",
    links: [
      { title: "Login", path: "/login" },
      { title: "Sign Up", path: "/register" },
      { title: "Forgot Password", path: "/login?mode=otp" },
      { title: "API Keys", path: "/api-keys" },
    ],
  },
  {
    title: "About",
    links: [
      { title: "Our Story", path: "/about" },
      { title: "Sustainability", path: "/about#sustainability" },
      { title: "Careers", path: "/about#careers" },
      { title: "Press", path: "/about#press" },
      { title: "Blog & News", path: "/blog" },
      { title: "Affiliates", path: "/about#affiliates" },
      { title: "Store Locations", path: "/about#locations" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Terms & Conditions", path: "/terms" },
      { title: "Privacy Policy", path: "/privacy" },
      { title: "Cookie Policy", path: "/cookies" },
      { title: "Content Policy & AI Usage", path: "/content-policy" },
      { title: "Accessibility", path: "/accessibility" },
      { title: "Modern Slavery Statement", path: "/modern-slavery" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-stone-100 pt-16 pb-8 mt-20 rounded-sm" role="contentinfo" aria-label="Site footer">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" aria-label="Footer navigation">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 id={`footer-${section.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-semibold uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.path}
                      className="text-sm text-stone-600 hover:text-black transition-colors"
                      aria-label={`${link.title} - ${section.title} section`}
                      data-testid={`footer-link-${section.title.toLowerCase().replace(/\s+/g, '-')}-${link.title.toLowerCase().replace(/\s+/g, '-')}`}
                      data-agent-action="navigate"
                      data-agent-target={link.path}
                      data-agent-hint={`Navigate to ${link.title} page`}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Newsletter */}
        <section className="border-t border-stone-200 pt-8 mb-8" aria-labelledby="newsletter-heading">
          <div className="max-w-md mx-auto text-center">
            <h3 id="newsletter-heading" className="text-sm font-semibold uppercase tracking-wider mb-4">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm text-stone-600 mb-4">
              Be the first to know about new collections, special offers, and
              exclusive content.
            </p>
            <form 
              className="flex"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                // Newsletter signup logic would go here
              }}
              aria-label="Newsletter subscription form"
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="flex-grow bg-white px-4 py-2 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-black"
                aria-required="true"
                aria-label="Enter your email address for newsletter"
                data-testid="newsletter-email-input"
              />
              <button 
                type="submit"
                className="bg-black text-white px-6 py-2 hover:bg-stone-800 transition-colors"
                aria-label="Subscribe to newsletter"
                data-testid="newsletter-submit-button"
              >
                Sign Up
              </button>
            </form>
          </div>
        </section>

        {/* Social & Copyright */}
        <div className="border-t border-stone-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-stone-600 mb-4 md:mb-0" aria-label="Copyright information">
              © 2025 THE STORE. All rights reserved.
            </p>
            <nav className="flex space-x-6" aria-label="Social media links">
              <a 
                href={process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "https://instagram.com/thestore"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-600 hover:text-black" 
                aria-label="Visit our Instagram page"
                data-testid="social-instagram"
              >
                Instagram
              </a>
              <a 
                href={process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "https://twitter.com/thestore"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-600 hover:text-black" 
                aria-label="Visit our Twitter page"
                data-testid="social-twitter"
              >
                Twitter
              </a>
              <a 
                href={process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "https://facebook.com/thestore"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-600 hover:text-black" 
                aria-label="Visit our Facebook page"
                data-testid="social-facebook"
              >
                Facebook
              </a>
              <a 
                href={process.env.NEXT_PUBLIC_SOCIAL_PINTEREST || "https://pinterest.com/thestore"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-600 hover:text-black" 
                aria-label="Visit our Pinterest page"
                data-testid="social-pinterest"
              >
                Pinterest
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
