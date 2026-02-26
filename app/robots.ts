import type { MetadataRoute } from 'next';

/**
 * Dynamic robots.txt: Allow Googlebot, Disallow GPTBot and ClaudeBot.
 * Takes precedence over public/robots.txt when present.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
    ],
    sitemap: '/sitemap.xml',
  };
}
