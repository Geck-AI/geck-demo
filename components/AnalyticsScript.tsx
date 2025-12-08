'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { detectAgent } from '@/lib/agentDetection';

/**
 * Analytics Script Component
 * Fires analytics events for agent visits and conversions
 */
export default function AnalyticsScript() {
  const pathname = usePathname();

  useEffect(() => {
    // Detect agent from user agent
    const userAgent = navigator.userAgent;
    const agent = detectAgent(userAgent);

    // Only track if it's an agent
    if (agent.isAgent) {
      // Send to analytics API
      fetch('/api/analytics/agent-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: window.location.href,
          userAgent,
          referer: document.referrer || undefined,
        }),
      }).catch(err => {
        console.error('Failed to log agent visit:', err);
      });

      // Fire Google Analytics event (if GTM/GA is available)
      if (typeof window !== 'undefined') {
        const gtag = (window as { gtag?: (command: string, event: string, params: Record<string, string>) => void }).gtag;
        if (gtag) {
          gtag('event', 'agent_visit', {
            agent_name: agent.name,
            agent_type: agent.type,
            page_path: pathname,
          });
        }

        // Fire dataLayer event (for Google Tag Manager)
        const dataLayer = (window as { dataLayer?: Array<Record<string, unknown>> }).dataLayer;
        if (dataLayer) {
          dataLayer.push({
            event: 'agent_visit',
            agent_name: agent.name,
            agent_type: agent.type,
            page_path: pathname,
          });
        }
      }
    }
  }, [pathname]);

  return null;
}

