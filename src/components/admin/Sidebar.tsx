'use client';

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

  return (
    <aside className="w-64 min-h-screen bg-luxury-charcoal/80 border-r border-luxury-gunmetal/30 flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-luxury-gunmetal/20">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 border border-luxury-silver/30 flex items-center justify-center">
            <span className="text-luxury-silver font-display font-bold text-sm">M</span>
          </div>
          <div>
            <p className="text-sm text-luxury-white font-display">Manilakshmi</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-silver/40">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 ${
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
      <div className="p-4 border-t border-luxury-gunmetal/20 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 text-xs text-luxury-white/40 
                   hover:text-luxury-silver transition-colors duration-300"
        >
          <ExternalLink size={14} />
          <span>View Website</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-xs text-luxury-white/40 
                   hover:text-red-400 transition-colors duration-300"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
