'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * DataLayer Initialization Component
 * Initializes window.dataLayer for Google Tag Manager and analytics tracking
 */
export default function DataLayer() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize dataLayer if it doesn't exist
    const windowWithDataLayer = window as typeof window & { dataLayer?: Array<Record<string, unknown>> };
    if (!windowWithDataLayer.dataLayer) {
      windowWithDataLayer.dataLayer = [];
    }

    const dataLayer = windowWithDataLayer.dataLayer;

    // Push initial page view event
    dataLayer.push({
      event: 'page_view',
      page_path: pathname,
      page_title: document.title,
      page_location: window.location.href,
      timestamp: new Date().toISOString(),
    });

    // Push site configuration
    dataLayer.push({
      event: 'site_config',
      site_name: process.env.NEXT_PUBLIC_SITE_NAME || 'THE STORE',
      base_url: process.env.NEXT_PUBLIC_BASE_URL || window.location.origin,
      environment: process.env.NODE_ENV || 'development',
    });
  }, [pathname]);

  return null;
}

