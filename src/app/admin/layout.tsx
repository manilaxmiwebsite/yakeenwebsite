import { ReactNode } from 'react';

// Minimal admin layout - sidebar is disabled (causes crash, will fix later)
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-luxury-black p-6 md:p-8 lg:p-10">
      {children}
    </div>
  );
}
