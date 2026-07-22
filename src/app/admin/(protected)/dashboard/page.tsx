'use client';

import { useState, useEffect } from 'react';
import { Gem, FolderTree, Award, MessageCircle } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import StatCard from '@/components/admin/StatCard';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState('Not set');
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);

  // Fetch dashboard data
  useEffect(() => {
    if (status !== 'authenticated') return;

    async function fetchData() {
      try {
        const [prodRes, catRes, certRes, settingsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/certificates'),
          fetch('/api/settings'),
        ]);

        const products = await prodRes.json();
        const categories = await catRes.json();
        const certificates = await certRes.json();
        const settings = await settingsRes.json();

        setProductCount(Array.isArray(products) ? products.length : 0);
        setCategoryCount(Array.isArray(categories) ? categories.length : 0);
        setCertificateCount(Array.isArray(certificates) ? certificates.length : 0);
        setWhatsappNumber(settings?.whatsappNumber || 'Not set');
      } catch {
        setDbError('Could not connect to database. Check your MongoDB connection string.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-luxury-silver/40 text-sm tracking-[0.2em] uppercase">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-luxury-white/40 text-sm">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 border border-luxury-silver/30 flex items-center justify-center">
            <span className="text-luxury-silver text-lg font-display font-bold">M</span>
          </div>
          <div>
            <h1 className="text-2xl font-display text-luxury-white">Manilakshmi Silver</h1>
            <p className="text-xs tracking-[0.2em] uppercase text-luxury-silver/40">Admin Panel</p>
          </div>
        </div>
        <div className="h-[1px] bg-gradient-to-r from-luxury-gunmetal/50 to-transparent mt-4" />
      </div>

      {dbError && (
        <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10">
          <p className="text-red-400 text-sm">{dbError}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          icon={Gem}
          label="Total Products"
          value={productCount}
          description={`${productCount} products in catalog`}
        />
        <StatCard
          icon={FolderTree}
          label="Categories"
          value={categoryCount}
          description="Product categories"
        />
        <StatCard
          icon={Award}
          label="Certificates"
          value={certificateCount}
          description="Authenticity certificates"
        />
        <StatCard
          icon={MessageCircle}
          label="WhatsApp Number"
          value={whatsappNumber}
          description="Inquiry message is configurable"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-luxury-charcoal/60 border border-luxury-gunmetal/30 p-6 md:p-8">
        <h2 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-6 font-medium">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/products"
            className="flex items-center justify-center gap-2 px-6 py-3.5 border border-luxury-gunmetal/40 
                     text-luxury-white/60 text-sm tracking-[0.1em] uppercase
                     hover:border-luxury-silver/30 hover:text-luxury-silver 
                     transition-all duration-300"
          >
            <Gem size={14} />
            <span>Manage Products</span>
          </a>
          <a
            href="/admin/categories"
            className="flex items-center justify-center gap-2 px-6 py-3.5 border border-luxury-gunmetal/40 
                     text-luxury-white/60 text-sm tracking-[0.1em] uppercase
                     hover:border-luxury-silver/30 hover:text-luxury-silver 
                     transition-all duration-300"
          >
            <FolderTree size={14} />
            <span>Manage Categories</span>
          </a>
          <a
            href="/admin/certificates"
            className="flex items-center justify-center gap-2 px-6 py-3.5 border border-luxury-gunmetal/40 
                     text-luxury-white/60 text-sm tracking-[0.1em] uppercase
                     hover:border-luxury-silver/30 hover:text-luxury-silver 
                     transition-all duration-300"
          >
            <Award size={14} />
            <span>Manage Certificates</span>
          </a>
          <a
            href="/admin/settings"
            className="flex items-center justify-center gap-2 px-6 py-3.5 border border-luxury-gunmetal/40 
                     text-luxury-white/60 text-sm tracking-[0.1em] uppercase
                     hover:border-luxury-silver/30 hover:text-luxury-silver 
                     transition-all duration-300"
          >
            <MessageCircle size={14} />
            <span>Site Settings</span>
          </a>
        </div>
      </div>
    </div>
  );
}
