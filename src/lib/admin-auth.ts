import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

/**
 * Check if the current user is authenticated as admin.
 * Redirects to login page if not authenticated.
 * Call this at the top of every protected admin page.
 */
export async function requireAdmin() {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch {
    session = null;
  }

  if (!session) {
    redirect('/admin/login');
  }

  return session;
}
