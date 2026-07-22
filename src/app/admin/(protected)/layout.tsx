import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminSidebar from '@/components/admin/Sidebar';

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  // Session check — must NOT be wrapped in try-catch because
  // next/navigation's redirect() throws an internal NEXT_REDIRECT
  // error that Next.js catches at the framework level.
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch {
    session = null;
  }

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-luxury-black">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6 md:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
