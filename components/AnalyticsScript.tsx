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
    if (typeof window === 'undefined') return;

    // Ensure dataLayer is initialized
    const windowWithDataLayer = window as typeof window & { dataLayer?: Array<Record<string, unknown>> };
    if (!windowWithDataLayer.dataLayer) {
      windowWithDataLayer.dataLayer = [];
    }

    const dataLayer = windowWithDataLayer.dataLayer;

    // Detect agent from user agent
    const userAgent = navigator.userAgent;
    const agent = detectAgent(userAgent);

    // Track all page views (not just agents)
    dataLayer.push({
      event: 'page_view',
      page_path: pathname,
      page_title: document.title,
      page_location: window.location.href,
      user_agent: userAgent,
      referrer: document.referrer || undefined,
      timestamp: new Date().toISOString(),
    });

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
      const gtag = (window as { gtag?: (command: string, event: string, params: Record<string, string>) => void }).gtag;
      if (gtag) {
        gtag('event', 'agent_visit', {
          agent_name: agent.name,
          agent_type: agent.type,
          page_path: pathname,
        });
      }

      // Fire dataLayer event (for Google Tag Manager)
      dataLayer.push({
        event: 'agent_visit',
        agent_name: agent.name,
        agent_type: agent.type,
        page_path: pathname,
        timestamp: new Date().toISOString(),
      });
    }

    // Track user interactions
    const trackClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        dataLayer.push({
          event: 'click',
          element_type: target.tagName.toLowerCase(),
          element_text: target.textContent?.trim() || '',
          element_href: (target as HTMLAnchorElement).href || undefined,
          page_path: pathname,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Track form submissions
    const trackSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      dataLayer.push({
        event: 'form_submit',
        form_id: form.id || form.name || 'unknown',
        form_action: form.action || undefined,
        page_path: pathname,
        timestamp: new Date().toISOString(),
      });
    };

    document.addEventListener('click', trackClick);
    document.addEventListener('submit', trackSubmit);

    return () => {
      document.removeEventListener('click', trackClick);
      document.removeEventListener('submit', trackSubmit);
    };
  }, [pathname]);

  return null;
}

