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
      { title: "Contact Us", path: "#" },
      { title: "Delivery Information", path: "#" },
      { title: "Returns & Exchanges", path: "#" },
      { title: "Payment Options", path: "#" },
      { title: "Size Guide", path: "#" },
      { title: "Order Tracking", path: "#" },
    ],
  },
  {
    title: "About",
    links: [
      { title: "Our Story", path: "#" },
      { title: "Sustainability", path: "#" },
      { title: "Careers", path: "#" },
      { title: "Press", path: "#" },
      { title: "Affiliates", path: "#" },
      { title: "Store Locations", path: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Terms & Conditions", path: "#" },
      { title: "Privacy Policy", path: "#" },
      { title: "Cookie Policy", path: "#" },
      { title: "Accessibility", path: "#" },
      { title: "Modern Slavery Statement", path: "#" },
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
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3" role="list">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.path}
                      className="text-sm text-stone-600 hover:text-black transition-colors"
                      aria-label={`${link.title} - ${section.title} section`}
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
              />
              <button 
                type="submit"
                className="bg-black text-white px-6 py-2 hover:bg-stone-800 transition-colors"
                aria-label="Subscribe to newsletter"
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
              <a href="#" className="text-stone-600 hover:text-black" aria-label="Visit our Instagram page">
                Instagram
              </a>
              <a href="#" className="text-stone-600 hover:text-black" aria-label="Visit our Twitter page">
                Twitter
              </a>
              <a href="#" className="text-stone-600 hover:text-black" aria-label="Visit our Facebook page">
                Facebook
              </a>
              <a href="#" className="text-stone-600 hover:text-black" aria-label="Visit our Pinterest page">
                Pinterest
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
