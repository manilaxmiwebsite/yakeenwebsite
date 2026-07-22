'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#E8E8E8',
            border: '1px solid rgba(42,42,42,0.5)',
            borderRadius: '0',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#C0C0C0',
              secondary: '#0A0A0A',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0A0A0A',
            },
          },
        }}
      />
    </SessionProvider>
  );
}
