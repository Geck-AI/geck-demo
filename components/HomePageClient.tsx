'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

/**
 * Client component for homepage interactivity
 * Handles client-side only features like toast notifications
 */
export default function HomePageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if user just registered
    const registered = searchParams.get('registered');
    const name = searchParams.get('name');
    
    if (registered === 'true' && name) {
      const userName = decodeURIComponent(name);
      
      // Show toast notification
      toast.success(`Registered user: ${userName}`);
      
      // Remove query params from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('registered');
      newUrl.searchParams.delete('name');
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    }
  }, [searchParams, router]);

  // This component doesn't render anything visible
  // It only handles client-side effects
  return null;
}

