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
        {/* Initialize DataLayer for Google Tag Manager and analytics */}
        <Script
          id="dataLayer-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'}', {
                page_path: window.location.pathname,
                send_page_view: true
              });
            `,
          }}
        />
        {/* Google Analytics (gtag.js) */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
          </>
        )}
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
