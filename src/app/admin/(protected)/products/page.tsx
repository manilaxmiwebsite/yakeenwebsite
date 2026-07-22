'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Star, Search, X } from 'lucide-react';
import { IProduct, ICategory } from '@/types';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    caption: '',
    details: [''],
    images: [''],
    category: '',
    isActive: true,
    isHero: false,
    heroOrder: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProducts(Array.isArray(prodData) ? prodData : []);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      caption: '',
      details: [''],
      images: [''],
      category: '',
      isActive: true,
      isHero: false,
      heroOrder: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: IProduct) => {
    setForm({
      name: product.name,
      description: product.description || '',
      caption: product.caption || '',
      details: product.details?.length ? product.details : [''],
      images: product.images?.length ? product.images : [''],
      category: typeof product.category === 'object' ? product.category._id : product.category,
      isActive: product.isActive,
      isHero: product.isHero,
      heroOrder: product.heroOrder || 0,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      details: form.details.filter((d) => d.trim()),
      images: form.images.filter((img) => img.trim()),
    };

    if (!payload.name || !payload.category) {
      toast.error('Name and category are required');
      return;
    }

    try {
      const url = editingId
        ? `/api/products/${editingId}`
        : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save');

      toast.success(editingId ? 'Product updated' : 'Product created');
      resetForm();
      fetchData();
    } catch {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Product deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-luxury-white/40 text-sm">Loading...</div>
      </div>
    );
  }

  const filteredProducts = Array.isArray(products)
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div>
      {/* Back to Dashboard */}
      <a href="/admin/dashboard" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase 
                text-luxury-silver/50 hover:text-luxury-silver transition-colors duration-300 mb-6 group">
        <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
        <span>Back to Dashboard</span>
      </a>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-luxury-white">Products</h1>
          <p className="text-sm text-luxury-white/40 mt-1">
            Manage your silver product catalog
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-luxury-white text-luxury-black 
                   text-xs tracking-[0.15em] uppercase font-medium
                   hover:bg-luxury-silver transition-all duration-300"
        >
          <Plus size={14} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="h-[1px] bg-gradient-to-r from-luxury-gunmetal/50 to-transparent mb-8" />

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 pb-10 overflow-y-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative w-full max-w-2xl mx-4 bg-luxury-charcoal border border-luxury-gunmetal/40 p-8 animate-scale-in">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-luxury-white/40 hover:text-luxury-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-display text-luxury-white mb-6">
              {editingId ? 'Edit Product' : 'New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm"
                    placeholder="Product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 text-sm text-luxury-white/60">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="accent-luxury-silver"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm text-luxury-white/60">
                    <input
                      type="checkbox"
                      checked={form.isHero}
                      onChange={(e) => setForm({ ...form, isHero: e.target.checked })}
                      className="accent-luxury-silver"
                    />
                    <Star size={14} /> Show in Hero
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Caption (for hero)</label>
                <input
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm"
                  placeholder="A short elegant caption"
                />
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm resize-none"
                  placeholder="Product description"
                />
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Product Images</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative">
                      <ImageUpload
                        currentImage={img}
                        onUpload={(url) => {
                          const newImages = [...form.images];
                          newImages[i] = url;
                          setForm({ ...form, images: newImages });
                        }}
                        onRemove={form.images.length > 1 ? () => setForm({ ...form, images: form.images.filter((_, j) => j !== i) }) : undefined}
                        label={`Image ${i + 1}`}
                        aspectRatio="aspect-[1/1]"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, images: [...form.images, ''] })}
                  className="text-xs text-luxury-silver/50 hover:text-luxury-silver mt-1"
                >
                  + Add another image
                </button>
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Product Details</label>
                {form.details.map((detail, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={detail}
                      onChange={(e) => {
                        const newDetails = [...form.details];
                        newDetails[i] = e.target.value;
                        setForm({ ...form, details: newDetails });
                      }}
                      className="flex-1 bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm"
                      placeholder="e.g. Pure Silver 925"
                    />
                    {form.details.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, details: form.details.filter((_, j) => j !== i) })}
                        className="text-red-400/60 hover:text-red-400 px-2"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, details: [...form.details, ''] })}
                  className="text-xs text-luxury-silver/50 hover:text-luxury-silver mt-1"
                >
                  + Add detail
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-luxury-white text-luxury-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-luxury-silver transition-all duration-300"
                >
                  {editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-luxury-gunmetal/40 text-luxury-white/50 text-xs tracking-[0.15em] uppercase hover:border-luxury-silver/30 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-xs mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-luxury-charcoal border border-luxury-gunmetal/40 pl-10 pr-4 py-2.5 text-sm text-luxury-white placeholder:text-luxury-white/20 focus:outline-none focus:border-luxury-silver/30"
        />
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-luxury-charcoal/60 border border-luxury-gunmetal/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-luxury-gunmetal/30">
              <th className="text-left py-3 px-4 text-xs tracking-[0.15em] uppercase text-luxury-white/40 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-xs tracking-[0.15em] uppercase text-luxury-white/40 font-medium">Category</th>
              <th className="text-center py-3 px-4 text-xs tracking-[0.15em] uppercase text-luxury-white/40 font-medium">Status</th>
              <th className="text-center py-3 px-4 text-xs tracking-[0.15em] uppercase text-luxury-white/40 font-medium">Hero</th>
              <th className="text-right py-3 px-4 text-xs tracking-[0.15em] uppercase text-luxury-white/40 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-luxury-white/30 text-sm">
                  {search ? 'No products match your search' : 'No products yet. Add your first product.'}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id} className="border-b border-luxury-gunmetal/10 hover:bg-luxury-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt="" className="w-10 h-10 object-cover" />
                      )}
                      <span className="text-luxury-white/80">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-luxury-white/50">
                    {typeof product.category === 'object' ? product.category.name : '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs px-2 py-1 ${
                      product.isActive ? 'text-green-400 bg-green-400/10' : 'text-luxury-white/30 bg-luxury-white/5'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Star size={14} className={`mx-auto ${product.isHero ? 'text-yellow-500' : 'text-luxury-white/20'}`} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-luxury-white/40 hover:text-luxury-silver transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-luxury-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
