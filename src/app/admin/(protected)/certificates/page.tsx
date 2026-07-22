'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { ICertificate } from '@/types';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', image: '', isActive: true });

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      setCertificates(data);
    } catch {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image) {
      toast.error('Title and image are required');
      return;
    }
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Certificate added');
      setForm({ title: '', image: '', isActive: true });
      setShowForm(false);
      fetchData();
    } catch {
      toast.error('Failed to add certificate');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certificate?')) return;
    try {
      const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Certificate deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-luxury-white/40 text-sm">Loading...</div>;

  return (
    <div>
      {/* Back to Dashboard */}
      <a href="/admin/dashboard" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase 
                text-luxury-silver/50 hover:text-luxury-silver transition-colors duration-300 mb-6 group">
        <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
        <span>Back to Dashboard</span>
      </a>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-luxury-white">Certificates</h1>
          <p className="text-sm text-luxury-white/40 mt-1">Upload authenticity certificates</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-luxury-white text-luxury-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-luxury-silver transition-all duration-300"
        >
          <Plus size={14} />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="h-[1px] bg-gradient-to-r from-luxury-gunmetal/50 to-transparent mb-8" />

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-lg mx-4 bg-luxury-charcoal border border-luxury-gunmetal/40 p-8 animate-scale-in">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-luxury-white/40 hover:text-luxury-white"><X size={20} /></button>
            <h2 className="text-lg font-display text-luxury-white mb-6">New Certificate</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" required />
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Certificate Image *</label>
                <ImageUpload
                  currentImage={form.image}
                  onUpload={(url) => setForm({ ...form, image: url })}
                  onRemove={() => setForm({ ...form, image: '' })}
                  aspectRatio="aspect-[3/4]"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-luxury-white/60">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-luxury-silver" />
                Active
              </label>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="px-6 py-3 bg-luxury-white text-luxury-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-luxury-silver transition-all duration-300">Add Certificate</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-luxury-gunmetal/40 text-luxury-white/50 text-xs tracking-[0.15em] uppercase hover:border-luxury-silver/30 transition-all duration-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificates Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {certificates.length === 0 ? (
          <div className="col-span-full text-center py-12 text-luxury-white/30">No certificates uploaded yet.</div>
        ) : (
          certificates.map((cert) => (
            <div key={cert._id} className="group relative bg-luxury-charcoal/60 border border-luxury-gunmetal/30 overflow-hidden hover:border-luxury-silver/20 transition-all duration-500">
              <div className="aspect-[3/4]">
                <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                <button
                  onClick={() => handleDelete(cert._id)}
                  className="text-white/0 group-hover:text-red-400 transition-all duration-300"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="p-3 border-t border-luxury-gunmetal/20">
                <p className="text-xs text-luxury-white/70 truncate">{cert.title}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
