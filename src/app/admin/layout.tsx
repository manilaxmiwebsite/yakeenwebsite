import { ReactNode } from 'react';

// Root admin layout - just renders children
// Auth protection is handled by the (protected) route group layout
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
