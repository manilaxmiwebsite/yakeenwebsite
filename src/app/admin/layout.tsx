import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';

// Root admin layout - provides sidebar + wrapper (no auth check here)
// Auth is handled individually on pages that need it (e.g., dashboard)
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
