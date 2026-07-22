import { ReactNode } from 'react';
import { requireAdmin } from '@/lib/admin-auth';
import AdminSidebar from '@/components/admin/Sidebar';

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  // Auth check with error handling — redirect() is safely outside try-catch in requireAdmin()
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-luxury-black">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6 md:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
