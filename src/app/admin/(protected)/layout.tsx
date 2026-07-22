'use client';

import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-luxury-black">
      <AdminSidebar />
      <main className="flex-1 overflow-x-auto">
        <div className="p-6 md:p-8 lg:p-10 min-w-0">{children}</div>
      </main>
    </div>
  );
}
