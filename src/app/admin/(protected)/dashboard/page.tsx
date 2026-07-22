// DEBUG: Minimal dashboard — no DB, no auth imports, no sidebar
export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-display text-luxury-white mb-4">Dashboard</h1>
      <p className="text-luxury-white/60">If you can see this, the basic page renders fine.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-luxury-charcoal/60 border border-luxury-gunmetal/30 p-6">
          <p className="text-xs uppercase tracking-wider text-luxury-white/40">Test Card 1</p>
          <p className="text-2xl font-display text-luxury-white mt-2">OK</p>
        </div>
        <div className="bg-luxury-charcoal/60 border border-luxury-gunmetal/30 p-6">
          <p className="text-xs uppercase tracking-wider text-luxury-white/40">Test Card 2</p>
          <p className="text-2xl font-display text-luxury-white mt-2">OK</p>
        </div>
        <div className="bg-luxury-charcoal/60 border border-luxury-gunmetal/30 p-6">
          <p className="text-xs uppercase tracking-wider text-luxury-white/40">Test Card 3</p>
          <p className="text-2xl font-display text-luxury-white mt-2">OK</p>
        </div>
      </div>
    </div>
  );
}
