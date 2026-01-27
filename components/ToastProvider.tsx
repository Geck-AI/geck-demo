'use client';

import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

export default function ToastProvider({ children }: { children?: ReactNode }) {
  return (
    <>
      {children}
      <div 
        id="toast-container"
        role="region"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Notifications"
        className="sr-only"
      >
        {/* Screen reader announcements */}
      </div>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {/* Toast notifications will be announced here */}
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: '100px',
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#fff',
            color: '#363636',
          },
          success: {
            duration: 5000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}
