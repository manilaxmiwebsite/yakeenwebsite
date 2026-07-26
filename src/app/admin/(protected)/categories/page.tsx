'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, X, FolderKanban, Layers } from 'lucide-react';
import { ICategory } from '@/types';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    images: [''] as string[],
    parentId: '',
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

  // Separate top-level categories and subcategories
  const topLevelCategories = categories.filter(c => !c.parentId);
  const getSubCategories = (parentId: string) =>
    categories.filter(c => c.parentId === parentId);

  const resetForm = () => {
    setForm({ name: '', description: '', image: '', images: [''], parentId: '', isActive: true, order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddCategory = () => {
    resetForm();
    setShowForm(true);
  };

  const handleAddSubCategory = (parentId: string) => {
    const parent = categories.find(c => c._id === parentId);
    setForm({
      name: '',
      description: '',
      image: '',
      images: [''],
      parentId,
      isActive: true,
      order: getSubCategories(parentId).length,
    });
    setEditingId(null);
    setExpandedCategoryId(parentId);
    setShowForm(true);
  };

  const handleEdit = (cat: ICategory) => {
    setForm({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
      images: cat.images?.length ? cat.images : [''],
      parentId: cat.parentId || '',
      isActive: cat.isActive,
      order: cat.order || 0,
    });
    setEditingId(cat._id);
    // Auto-expand the parent when editing a subcategory
    if (cat.parentId) {
      setExpandedCategoryId(cat.parentId);
    }
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

  const toggleExpand = (id: string) => {
    setExpandedCategoryId(expandedCategoryId === id ? null : id);
  };

  // Get form title based on context
  const getFormTitle = () => {
    if (editingId) {
      const cat = categories.find(c => c._id === editingId);
      if (cat?.parentId) {
        const parent = categories.find(c => c._id === cat.parentId);
        return `Edit Subcategory (in ${parent?.name || '...'})`;
      }
      return 'Edit Category';
    }
    if (form.parentId) {
      const parent = categories.find(c => c._id === form.parentId);
      return `New Subcategory (in ${parent?.name || '...'})`;
    }
    return 'New Top-Level Category';
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
          onClick={handleAddCategory}
          className="flex items-center gap-2 px-5 py-2.5 bg-luxury-white text-luxury-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-luxury-silver transition-all duration-300"
        >
          <Plus size={14} />
          <span>Add Top-Level Category</span>
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
            <h2 className="text-lg font-display text-luxury-white mb-6">{getFormTitle()}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Show parent info when adding subcategory */}
              {form.parentId && !editingId && (
                <div className="bg-luxury-black/50 border border-luxury-gunmetal/30 px-4 py-2.5 mb-2">
                  <p className="text-xs text-luxury-silver/60">
                    This will be a subcategory of <span className="text-luxury-silver">{categories.find(c => c._id === form.parentId)?.name}</span>
                  </p>
                </div>
              )}
              {editingId && (() => {
                const editingCat = categories.find(c => c._id === editingId);
                if (editingCat?.parentId) {
                  const parent = categories.find(c => c._id === editingCat.parentId);
                  return (
                    <div className="bg-luxury-black/50 border border-luxury-gunmetal/30 px-4 py-2.5 mb-2">
                      <p className="text-xs text-luxury-silver/60">
                        Subcategory of <span className="text-luxury-silver">{parent?.name}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" required />
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Category Images</label>
                <p className="text-xs text-luxury-white/20 mb-3">Upload multiple images. These will be shown as a slideshow on the homepage.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  {form.images.map((img, i) => (
                    <ImageUpload
                      key={i}
                      currentImage={img}
                      onUpload={(url) => {
                        const newImages = [...form.images];
                        newImages[i] = url;
                        setForm({ ...form, images: newImages, image: i === 0 ? url : form.image });
                      }}
                      onRemove={form.images.length > 1 ? () => {
                        const newImages = form.images.filter((_, j) => j !== i);
                        const newImage = i === 0 ? (newImages[0] || '') : form.image;
                        setForm({ ...form, images: newImages, image: newImage });
                      } : undefined}
                      label={`Image ${i + 1}`}
                      aspectRatio="aspect-[16/9]"
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, images: [...form.images, ''] })}
                  className="text-xs text-luxury-silver/50 hover:text-luxury-silver transition-colors"
                >
                  + Add another image
                </button>
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

      {/* Categories Tree */}
      {topLevelCategories.length === 0 ? (
        <div className="text-center py-20 text-luxury-white/30">
          <FolderKanban size={40} className="mx-auto mb-4 text-luxury-white/10" />
          <p className="text-lg font-display text-luxury-white/40 mb-2">No categories yet</p>
          <p className="text-sm text-luxury-white/20">Create your first top-level category to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topLevelCategories.map((cat) => {
            const subItems = getSubCategories(cat._id);
            const isExpanded = expandedCategoryId === cat._id;

            return (
              <div key={cat._id} className="bg-luxury-charcoal/40 border border-luxury-gunmetal/30 overflow-hidden">
                {/* Top-level category header */}
                <div className="flex items-center gap-4 p-5 hover:bg-luxury-charcoal/80 transition-all duration-300">
                  {/* Expand toggle (only if has subcategories or always) */}
                  <button
                    onClick={() => toggleExpand(cat._id)}
                    className="text-luxury-white/30 hover:text-luxury-silver transition-colors shrink-0"
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {/* Image */}
                  <div className="w-14 h-14 shrink-0 bg-luxury-black border border-luxury-gunmetal/30 overflow-hidden">
                    {cat.images?.[0] || cat.image ? (
                      <img src={cat.images?.[0] || cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-luxury-white/10 font-display text-xl">{cat.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-display text-luxury-white">{cat.name}</h3>
                      <span className="text-[10px] text-luxury-silver/40 bg-luxury-black/50 px-2 py-0.5">
                        <FolderKanban size={10} className="inline mr-1" />
                        Top-Level
                      </span>
                    </div>
                    {cat.description && <p className="text-xs text-luxury-white/40 mt-1 line-clamp-2">{cat.description}</p>}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 ${cat.isActive ? 'text-green-400 bg-green-400/10' : 'text-luxury-white/30 bg-luxury-white/5'}`}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-[10px] text-luxury-white/20">Order: {cat.order}</span>
                      {subItems.length > 0 && (
                        <span className="text-[10px] text-blue-400/60">{subItems.length} subcategor{(subItems.length || 0) > 1 ? 'ies' : 'y'}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddSubCategory(cat._id)}
                      className="flex items-center gap-1.5 text-[10px] tracking-[0.1em] uppercase text-luxury-silver/50 hover:text-luxury-silver transition-colors px-3 py-1.5 border border-luxury-gunmetal/30 hover:border-luxury-silver/30"
                    >
                      <Plus size={12} />
                      <span className="hidden sm:inline">Add Subcategory</span>
                    </button>
                    <button onClick={() => handleEdit(cat)} className="text-luxury-white/40 hover:text-luxury-silver transition-colors p-1.5">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="text-luxury-white/40 hover:text-red-400 transition-colors p-1.5">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded subcategories */}
                {isExpanded && (
                  <div className="border-t border-luxury-gunmetal/20">
                    {subItems.length === 0 ? (
                      <div className="px-5 py-6 text-center">
                        <Layers size={24} className="mx-auto mb-2 text-luxury-white/10" />
                        <p className="text-sm text-luxury-white/30">No subcategories yet</p>
                        <button
                          onClick={() => handleAddSubCategory(cat._id)}
                          className="mt-2 text-xs tracking-[0.1em] uppercase text-luxury-silver/50 hover:text-luxury-silver transition-colors inline-flex items-center gap-1"
                        >
                          <Plus size={12} />
                          <span>Add Subcategory</span>
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-luxury-gunmetal/10">
                        {subItems.map((sub) => (
                          <div key={sub._id} className="flex items-center gap-4 px-5 py-3.5 pl-14 hover:bg-luxury-black/30 transition-all duration-300">
                            {/* Small image */}
                            <div className="w-10 h-10 shrink-0 bg-luxury-black border border-luxury-gunmetal/30 overflow-hidden">
                              {sub.images?.[0] || sub.image ? (
                                <img src={sub.images?.[0] || sub.image} alt={sub.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-luxury-white/10 font-display text-sm">{sub.name.charAt(0)}</span>
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-display text-luxury-white/90">{sub.name}</h4>
                                <span className="text-[10px] text-blue-400/50 bg-blue-400/5 px-1.5 py-0.5">Sub</span>
                              </div>
                              {sub.description && <p className="text-xs text-luxury-white/30 mt-0.5 line-clamp-1">{sub.description}</p>}
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] px-1.5 py-0.5 ${sub.isActive ? 'text-green-400/70 bg-green-400/5' : 'text-luxury-white/20 bg-luxury-white/5'}`}>
                                  {sub.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-[10px] text-luxury-white/20">Order: {sub.order}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1 shrink-0">
                              <button onClick={() => handleEdit(sub)} className="text-luxury-white/30 hover:text-luxury-silver transition-colors p-1">
                                <Edit2 size={12} />
                              </button>
                              <button onClick={() => handleDelete(sub._id)} className="text-luxury-white/30 hover:text-red-400 transition-colors p-1">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
