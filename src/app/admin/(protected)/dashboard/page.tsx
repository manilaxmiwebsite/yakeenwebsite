import { Gem, FolderTree, Award, MessageCircle } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { Category } from '@/lib/models/Category';
import { Certificate } from '@/lib/models/Certificate';
import { getSiteSettings } from '@/lib/site-data';
import StatCard from '@/components/admin/StatCard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await connectDB();

  const [productCount, categoryCount, certificateCount, settings] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Certificate.countDocuments(),
    getSiteSettings(),
  ]);

  const activeProducts = await Product.countDocuments({ isActive: true });
  const heroProducts = await Product.countDocuments({ isHero: true });

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-display text-luxury-white">Dashboard</h1>
        <p className="text-sm text-luxury-white/40 mt-1">
          Welcome to the Manilakshmi Silver admin panel
        </p>
        <div className="h-[1px] bg-gradient-to-r from-luxury-gunmetal/50 to-transparent mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          icon={Gem}
          label="Total Products"
          value={productCount}
          description={`${activeProducts} active • ${heroProducts} featured in hero`}
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
          value={settings.whatsappNumber || 'Not set'}
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
