'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Gem,
  FolderTree,
  Award,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Gem },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/certificates', label: 'Certificates', icon: Award },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="p-4 md:p-6 border-b border-luxury-gunmetal/20">
        <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={closeMobile}>
          <div className="w-8 h-8 md:w-9 md:h-9 border border-luxury-silver/30 flex items-center justify-center">
            <span className="text-luxury-silver font-display font-bold text-xs md:text-sm">M</span>
          </div>
          <div>
            <p className="text-sm text-luxury-white font-display">Manilakshmi</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-silver/40">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Close button on mobile */}
      <button
        onClick={closeMobile}
        className="lg:hidden absolute top-4 right-4 text-luxury-white/50 hover:text-luxury-white"
      >
        <X size={20} />
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-3 md:p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-luxury-silver/10 text-luxury-silver border-l-2 border-luxury-silver'
                  : 'text-luxury-white/50 hover:text-luxury-white/80 hover:bg-luxury-white/5 border-l-2 border-transparent'
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 md:p-4 border-t border-luxury-gunmetal/20 space-y-2">
        <Link
          href="/"
          target="_blank"
          onClick={closeMobile}
          className="flex items-center gap-3 px-3 md:px-4 py-2 text-xs text-luxury-white/40 
                   hover:text-luxury-silver transition-colors duration-300"
        >
          <ExternalLink size={14} />
          <span>View Website</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 w-full px-3 md:px-4 py-2 text-xs text-luxury-white/40 
                   hover:text-red-400 transition-colors duration-300"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-9 h-9 bg-luxury-charcoal border border-luxury-gunmetal/40 
                   flex items-center justify-center text-luxury-white/60 hover:text-luxury-white
                   transition-colors duration-300"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar - mobile: overlay, desktop: fixed */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 md:w-72 min-h-screen bg-luxury-charcoal/95 lg:bg-luxury-charcoal/80 
                   border-r border-luxury-gunmetal/30 flex flex-col
                   transition-transform duration-300 lg:translate-x-0
                   ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
