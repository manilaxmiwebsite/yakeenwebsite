import { ReactNode } from 'react';

// DEBUG: Minimal admin layout - NO sidebar, NO auth, NO imports
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-luxury-black p-8">
      {children}
    </div>
  );
}
