'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  description?: string;
}

export default function StatCard({ icon: Icon, label, value, description }: StatCardProps) {
  return (
    <div className="bg-luxury-charcoal/60 border border-luxury-gunmetal/30 p-6 hover:border-luxury-silver/20 transition-all duration-500">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-luxury-white/40">{label}</p>
          <p className="text-3xl font-display text-luxury-white mt-2">{value}</p>
        </div>
        <div className="w-10 h-10 border border-luxury-silver/20 flex items-center justify-center">
          <Icon size={18} className="text-luxury-silver/60" />
        </div>
      </div>
      {description && (
        <p className="text-xs text-luxury-white/30">{description}</p>
      )}
    </div>
  );
}
