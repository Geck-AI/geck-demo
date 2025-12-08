'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Staging Banner Component
 * Displays a banner when in staging/test mode
 */
export default function StagingBanner() {
  const [isStagingEnv, setIsStagingEnv] = useState(false);

  useEffect(() => {
    // Check if we're in staging mode
    fetch('/api/staging/info')
      .then(res => res.json())
      .then(data => {
        setIsStagingEnv(data.isStaging || false);
      })
      .catch(() => {
        // Silently fail - don't show banner if check fails
      });
  }, []);

  if (!isStagingEnv) {
    return null;
  }

  return (
    <div 
      className="bg-yellow-400 text-black px-4 py-2 text-center text-sm font-medium"
      role="banner"
      aria-label="Staging environment indicator"
      data-agent-role="staging-banner"
      data-agent-hint="This is a staging/test environment. Safe for automated testing."
    >
      🧪 <strong>STAGING MODE</strong> - This is a test environment. Safe for automated testing.{' '}
      <Link 
        href="/staging-guide" 
        className="underline hover:no-underline font-semibold"
        aria-label="View staging guide"
      >
        View Staging Guide
      </Link>
    </div>
  );
}

