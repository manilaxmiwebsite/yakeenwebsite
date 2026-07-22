import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';

// Step 1: Add sidebar back to test if it crashes
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-luxury-black">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6 md:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
