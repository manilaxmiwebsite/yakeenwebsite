import { ReactNode } from 'react';

// Root admin layout - renders children (protected routes add sidebar via their own layout)
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
