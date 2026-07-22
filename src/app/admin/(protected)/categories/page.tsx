'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, MoveUp, MoveDown, X } from 'lucide-react';
import { ICategory } from '@/types';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
    order: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setForm({ name: '', description: '', image: '', isActive: true, order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (cat: ICategory) => {
    setForm({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
      isActive: cat.isActive,
      order: cat.order || 0,
    });
    setEditingId(cat._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Name is required');
      return;
    }

    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to save');
      toast.success(editingId ? 'Category updated' : 'Category created');
      resetForm();
      fetchData();
    } catch {
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products in this category must be moved or deleted first.')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete');
        return;
      }
      toast.success('Category deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return <div className="text-luxury-white/40 text-sm">Loading...</div>;
  }

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
          <h1 className="text-2xl font-display text-luxury-white">Categories</h1>
          <p className="text-sm text-luxury-white/40 mt-1">Organize your products into collections</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-luxury-white text-luxury-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-luxury-silver transition-all duration-300"
        >
          <Plus size={14} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="h-[1px] bg-gradient-to-r from-luxury-gunmetal/50 to-transparent mb-8" />

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative w-full max-w-lg mx-4 bg-luxury-charcoal border border-luxury-gunmetal/40 p-8 animate-scale-in">
            <button onClick={resetForm} className="absolute top-4 right-4 text-luxury-white/40 hover:text-luxury-white">
              <X size={20} />
            </button>
            <h2 className="text-lg font-display text-luxury-white mb-6">{editingId ? 'Edit Category' : 'New Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" required />
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Category Image</label>
                <ImageUpload
                  currentImage={form.image}
                  onUpload={(url) => setForm({ ...form, image: url })}
                  onRemove={() => setForm({ ...form, image: '' })}
                  aspectRatio="aspect-[4/3]"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" />
                </div>
                <div className="pt-6">
                  <label className="flex items-center gap-2 text-sm text-luxury-white/60">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-luxury-silver" />
                    Active
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="px-6 py-3 bg-luxury-white text-luxury-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-luxury-silver transition-all duration-300">
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-3 border border-luxury-gunmetal/40 text-luxury-white/50 text-xs tracking-[0.15em] uppercase hover:border-luxury-silver/30 transition-all duration-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-luxury-white/30">
            No categories yet. Create your first category.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="bg-luxury-charcoal/60 border border-luxury-gunmetal/30 p-5 hover:border-luxury-silver/20 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 bg-luxury-black border border-luxury-gunmetal/30 overflow-hidden">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-luxury-white/10 font-display text-xl">{cat.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-display text-luxury-white">{cat.name}</h3>
                  {cat.description && <p className="text-xs text-luxury-white/40 mt-1 line-clamp-2">{cat.description}</p>}
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 ${cat.isActive ? 'text-green-400 bg-green-400/10' : 'text-luxury-white/30 bg-luxury-white/5'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-[10px] text-luxury-white/20">Order: {cat.order}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(cat)} className="text-luxury-white/40 hover:text-luxury-silver transition-colors p-1">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="text-luxury-white/40 hover:text-red-400 transition-colors p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
