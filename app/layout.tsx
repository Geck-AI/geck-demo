import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import ToastProvider from "@/components/ToastProvider";
import { generateMetadata as generateSEOMetadata, generateStructuredData } from "@/lib/seo";
import AnalyticsScript from "@/components/AnalyticsScript";
import DataLayer from "@/components/DataLayer";
import StagingBanner from "@/components/StagingBanner";
import { isStaging, getEnvironment } from "@/lib/environment";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading for LCP
  preload: true, // Preload critical fonts
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading for LCP
  preload: false, // Only preload primary font
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'THE STORE';
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Shop the latest fashion trends, clothing, shoes, and accessories at THE STORE. Discover quality products with fast shipping and excellent customer service.';

export const metadata: Metadata = generateSEOMetadata({
  title: siteName,
  description: siteDescription,
  keywords: process.env.NEXT_PUBLIC_SITE_KEYWORDS || 'fashion, clothing, shoes, accessories, online shopping, apparel, footwear, style',
  url: '/',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const environment = getEnvironment();
  const isStagingEnv = isStaging();

  const organizationSchema = generateStructuredData('Organization');
  const websiteSchema = generateStructuredData('WebSite', {
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  });
  const creativeWorkSchema = generateStructuredData('CreativeWork', {
    name: siteName,
    url: baseUrl,
    license: 'https://creativecommons.org/licenses/by/4.0/',
  });

  return (
    <html lang="en">
      <head>
        {/* Resource hints for faster connections */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={baseUrl} />

        {/* Preload critical resources */}
        <link rel="preload" href="/cover.webp" as="image" type="image/webp" />

        <link rel="canonical" href={baseUrl} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="license" content="CC-BY-4.0" />
        <meta name="copyright" content={`© ${new Date().getFullYear()} ${siteName}. All rights reserved.`} />
        <link rel="license" href="https://creativecommons.org/licenses/by/4.0/" />
        {/* Staging/Test Environment Meta Tags */}
        <meta name="environment" content={environment} />
        <meta name="test-mode" content={isStagingEnv || environment === 'development' ? 'enabled' : 'disabled'} />
        <meta name="sandbox-mode" content={isStagingEnv ? 'enabled' : 'disabled'} />
        {isStagingEnv && (
          <>
            <meta name="robots" content="noindex, nofollow" />
            <meta name="staging-environment" content="true" />
            <meta name="safe-for-automation" content="true" />
          </>
        )}
        {/* Inline critical structured data to avoid blocking */}
        <script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          id="creativework-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(creativeWorkSchema),
          }}
        />
        {/* Google Analytics (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TR8PVN0CEK"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TR8PVN0CEK');
            `,
          }}
        />
        {/* Google Tag Manager */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `,
            }}
          />
        )}
        {/* AXO Agent Tracker Configuration */}
        <Script
          id="tracker-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Patch fetch to redirect tracking requests to our proxy
                const originalFetch = window.fetch;
                window.fetch = function(url, options) {
                  if (typeof url === 'string') {
                    // Redirect tracking API requests to our proxied endpoint
                    if (url.includes('https://api-dev.geck.ai/api/tracking')) {
                      url = url.replace('https://api-dev.geck.ai/api/tracking', '/api/tracking');
                    }
                    // Redirect rrweb script requests if needed
                    if (url.includes('http://localhost:3001/rrweb-record.min.js')) {
                      url = url.replace('http://localhost:3001/rrweb-record.min.js', '/rrweb-record.min.js');
                    }
                  }
                  return originalFetch.apply(this, arguments);
                };
                
                // Patch XMLHttpRequest for compatibility
                const originalXHROpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function(method, url, ...rest) {
                  if (typeof url === 'string') {
                    if (url.includes('https://api-dev.geck.ai/api/tracking')) {
                      url = url.replace('https://api-dev.geck.ai/api/tracking', '/api/tracking');
                    }
                  }
                  return originalXHROpen.apply(this, [method, url, ...rest]);
                };

                // Patch sendBeacon for session exit tracking
                if (navigator.sendBeacon) {
                  const originalSendBeacon = navigator.sendBeacon;
                  navigator.sendBeacon = function(url, data) {
                    if (typeof url === 'string') {
                      if (url.includes('https://api-dev.geck.ai/api/tracking')) {
                        url = url.replace('https://api-dev.geck.ai/api/tracking', '/api/tracking');
                      }
                    }
                    return originalSendBeacon.apply(this, [url, data]);
                  };
                }
              })();
            `,
          }}
        />
        {/* AXO Agent Tracker */}
        <Script
          src="/tracker.js"
          data-site-id="152"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased p-4`}
      >
        <StagingBanner />
        <a
          href="#main-content"
          data-testid="skip-to-main-content-link"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>
        <noscript>
          <style>{`
            .js-only { display: none !important; }
            .no-js-message {
              display: block !important;
              padding: 1rem;
              background-color: #fef3c7;
              border: 1px solid #fbbf24;
              border-radius: 0.5rem;
              margin: 1rem auto;
              max-width: 1200px;
            }
          `}</style>
          <div className="no-js-message">
            <p><strong>JavaScript is disabled.</strong> Some interactive features may not work.
              The site is still fully functional for browsing and shopping.</p>
          </div>
        </noscript>
        {/* Google Tag Manager (noscript) */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <ToastProvider>
          <DataLayer />
          <AnalyticsScript />
          <Navbar />
          <AuthGuard>
            <div id="main-content">
              {children}
            </div>
          </AuthGuard>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
