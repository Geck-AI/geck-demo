/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure SSR is enabled (default in Next.js)
  reactStrictMode: true,
  
  // Optimize images for LCP
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.myntassets.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'assets.myntassets.com',
        pathname: '/**',
      },
    ],
  },
  
  // Ensure proper HTML output
  poweredByHeader: false,
  
  // Compress output
  compress: true,
  
  // Note: SWC minification is enabled by default in Next.js 15
  
  // Experimental features for better SSR and performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-hot-toast'],
  },
  
  // Performance budgets for agent access
  // LCP target: ≤ 2.5s, INP target: ≤ 200ms, CLS target: ≤ 0.1, TTFB target: ≤ 600ms
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  
  // Rewrites to proxy external resources (e.g., tracker scripts)
  // Note: API routes handle /api/tracking/collect proxying
  async rewrites() {
    return [
      {
        source: '/tracker.js',
        destination: 'http://localhost:3005/tracker.js',
      },
      {
        source: '/rrweb-record.min.js',
        destination: 'http://localhost:3001/rrweb-record.min.js',
      },
      // Tracker expects /tracking/*; proxy to our API
      {
        source: '/tracking/collect',
        destination: '/api/tracking/collect',
      },
      {
        source: '/tracking/replay',
        destination: '/api/tracking/replay',
      },
    ];
  },
};

export default nextConfig;

