'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';
import { Save, Eye, EyeOff, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface InstagramImageEntry {
  image: string;
  caption: string;
}

interface Settings {
  whatsappNumber: string;
  whatsappMessage: string;
  heroSpeed: string;
  aboutTitle: string;
  aboutContent: string;
  aboutImage: string;
  footerBrandStatement: string;
  footerEmail: string;
  footerPhone: string;
  footerAddress: string;
  instagramUrl: string;
  instagramImages: InstagramImageEntry[];
  logo: string;
  brandName: string;
  headerLogo: string;
  sections: {
    hero: boolean;
    explore: boolean;
    about: boolean;
    certificates: boolean;
    instagram: boolean;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      // Parse instagramImages from JSON string if needed
      let parsedImages: InstagramImageEntry[] = [];
      if (data.instagramImages) {
        if (typeof data.instagramImages === 'string') {
          try { parsedImages = JSON.parse(data.instagramImages); } catch { parsedImages = []; }
        } else if (Array.isArray(data.instagramImages)) {
          parsedImages = data.instagramImages;
        }
      }
      setSettings({ ...data, instagramImages: parsedImages });
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      // Flatten sections into individual section_* keys so updateSettings() stores them correctly
      const { sections, ...rest } = settings;
      const flattened = {
        ...rest,
        section_hero: String(sections.hero),
        section_explore: String(sections.explore),
        section_about: String(sections.about),
        section_certificates: String(sections.certificates),
        section_instagram: String(sections.instagram),
        instagramImages: JSON.stringify(settings.instagramImages),
      };
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flattened),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Failed to change password');
        return;
      }
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch {
      toast.error('Failed to change password');
    }
  };

  const toggleSection = (key: keyof Settings['sections']) => {
    if (!settings) return;
    setSettings({
      ...settings,
      sections: { ...settings.sections, [key]: !settings.sections[key] },
    });
  };

  const updateField = (key: string, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const addInstagramImage = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      instagramImages: [...settings.instagramImages, { image: '', caption: '' }],
    });
  };

  const updateInstagramImage = (index: number, field: keyof InstagramImageEntry, value: string) => {
    if (!settings) return;
    const updated = [...settings.instagramImages];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, instagramImages: updated });
  };

  const removeInstagramImage = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      instagramImages: settings.instagramImages.filter((_, i) => i !== index),
    });
  };

  const moveInstagramImage = (index: number, direction: 'up' | 'down') => {
    if (!settings) return;
    const images = [...settings.instagramImages];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    [images[index], images[newIndex]] = [images[newIndex], images[index]];
    setSettings({ ...settings, instagramImages: images });
  };

  if (loading) return <div className="text-luxury-white/40 text-sm">Loading...</div>;
  if (!settings) return <div className="text-red-400 text-sm">Failed to load settings</div>;

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
          <h1 className="text-2xl font-display text-luxury-white">Site Settings</h1>
          <p className="text-sm text-luxury-white/40 mt-1">Manage all configurable site content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-luxury-white text-luxury-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-luxury-silver disabled:opacity-50 transition-all duration-300"
        >
          <Save size={14} />
          <span>{saving ? 'Saving...' : 'Save All'}</span>
        </button>
      </div>

      <div className="h-[1px] bg-gradient-to-r from-luxury-gunmetal/50 to-transparent mb-8" />

      <form onSubmit={handleSave} className="space-y-10 max-w-3xl">
        {/* Brand */}
        <section className="bg-luxury-charcoal/40 border border-luxury-gunmetal/20 p-6 md:p-8">
          <h2 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-6 font-medium">Brand Information</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Brand Name</label>
              <input value={settings.brandName} onChange={(e) => updateField('brandName', e.target.value)} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Logo URL</label>
              <input value={settings.logo} onChange={(e) => updateField('logo', e.target.value)} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" placeholder="https://..." />
            </div>
          </div>
        </section>

        {/* WhatsApp */}
        <section className="bg-luxury-charcoal/40 border border-luxury-gunmetal/20 p-6 md:p-8">
          <h2 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-6 font-medium">WhatsApp Integration</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">WhatsApp Number</label>
              <input value={settings.whatsappNumber} onChange={(e) => updateField('whatsappNumber', e.target.value)} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" placeholder="919876543210" />
              <p className="text-xs text-luxury-white/20 mt-1">Include country code without + sign. Leave empty to disable WhatsApp.</p>
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Default Inquiry Message</label>
              <textarea value={settings.whatsappMessage} onChange={(e) => updateField('whatsappMessage', e.target.value)} rows={3} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm resize-none" />
              <p className="text-xs text-luxury-white/20 mt-1">Use {'{product}'} as placeholder for the product name. Product URL is automatically appended.</p>
            </div>
          </div>
        </section>

        {/* Hero Carousel */}
        <section className="bg-luxury-charcoal/40 border border-luxury-gunmetal/20 p-6 md:p-8">
          <h2 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-6 font-medium">Hero Carousel</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Auto-Scroll Speed (milliseconds)</label>
              <input value={settings.heroSpeed} onChange={(e) => updateField('heroSpeed', e.target.value)} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" placeholder="5000" />
              <p className="text-xs text-luxury-white/20 mt-1">Lower = faster. 3000 = 3 seconds, 5000 = 5 seconds, 8000 = 8 seconds. Default: 5000.</p>
            </div>
          </div>
        </section>

        {/* About Us */}
        <section className="bg-luxury-charcoal/40 border border-luxury-gunmetal/20 p-6 md:p-8">
          <h2 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-6 font-medium">About Us Section</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Title</label>
              <input value={settings.aboutTitle} onChange={(e) => updateField('aboutTitle', e.target.value)} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Content</label>
              <textarea value={settings.aboutContent} onChange={(e) => updateField('aboutContent', e.target.value)} rows={6} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm resize-none" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">About Image URL</label>
              <input value={settings.aboutImage} onChange={(e) => updateField('aboutImage', e.target.value)} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" placeholder="https://..." />
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="bg-luxury-charcoal/40 border border-luxury-gunmetal/20 p-6 md:p-8">
          <h2 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-6 font-medium">Footer Content</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Brand Statement</label>
              <textarea value={settings.footerBrandStatement} onChange={(e) => updateField('footerBrandStatement', e.target.value)} rows={2} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm resize-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Email</label>
                <input value={settings.footerEmail} onChange={(e) => updateField('footerEmail', e.target.value)} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Phone</label>
                <input value={settings.footerPhone} onChange={(e) => updateField('footerPhone', e.target.value)} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Address</label>
              <input value={settings.footerAddress} onChange={(e) => updateField('footerAddress', e.target.value)} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" />
            </div>
          </div>
        </section>

        {/* Instagram */}
        <section className="bg-luxury-charcoal/40 border border-luxury-gunmetal/20 p-6 md:p-8">
          <h2 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-6 font-medium">Instagram</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">Instagram Profile URL</label>
              <input value={settings.instagramUrl} onChange={(e) => updateField('instagramUrl', e.target.value)} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" placeholder="https://instagram.com/..." />
            </div>

            {/* Instagram Images Manager */}
            <div className="pt-4 border-t border-luxury-gunmetal/20">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs tracking-[0.15em] uppercase text-luxury-silver/60">
                  Instagram Images ({settings.instagramImages.length})
                </label>
                <button
                  type="button"
                  onClick={addInstagramImage}
                  className="flex items-center gap-1.5 text-xs tracking-[0.1em] uppercase text-luxury-silver/50 hover:text-luxury-silver transition-colors"
                >
                  <Plus size={14} />
                  <span>Add Image</span>
                </button>
              </div>
              <p className="text-xs text-luxury-white/20 mb-4">
                Add custom images for the Instagram carousel. Leave empty to use placeholder images.
              </p>

              <div className="space-y-3">
                {settings.instagramImages.map((img, index) => (
                  <div key={index} className="border border-luxury-gunmetal/30 p-4 bg-luxury-black/30">
                    <div className="flex items-start gap-3">
                      {/* Preview */}
                      <div className="w-16 h-16 shrink-0 bg-luxury-charcoal border border-luxury-gunmetal/30 overflow-hidden">
                        {img.image ? (
                          <img src={img.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-luxury-white/10 text-xs">No img</div>
                        )}
                      </div>

                      {/* Fields */}
                      <div className="flex-1 space-y-2">
                        <input
                          value={img.image}
                          onChange={(e) => updateInstagramImage(index, 'image', e.target.value)}
                          placeholder="Image URL"
                          className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-3 py-1.5 text-xs text-luxury-white focus:outline-none focus:border-luxury-silver/30"
                        />
                        <input
                          value={img.caption}
                          onChange={(e) => updateInstagramImage(index, 'caption', e.target.value)}
                          placeholder="Caption"
                          className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-3 py-1.5 text-xs text-luxury-white focus:outline-none focus:border-luxury-silver/30"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 shrink-0">
                        {index > 0 && (
                          <button type="button" onClick={() => moveInstagramImage(index, 'up')}
                            className="text-luxury-white/30 hover:text-luxury-silver transition-colors p-1">
                            <MoveUp size={14} />
                          </button>
                        )}
                        {index < settings.instagramImages.length - 1 && (
                          <button type="button" onClick={() => moveInstagramImage(index, 'down')}
                            className="text-luxury-white/30 hover:text-luxury-silver transition-colors p-1">
                            <MoveDown size={14} />
                          </button>
                        )}
                        <button type="button" onClick={() => removeInstagramImage(index)}
                          className="text-luxury-white/30 hover:text-red-400 transition-colors p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Visibility */}
        <section className="bg-luxury-charcoal/40 border border-luxury-gunmetal/20 p-6 md:p-8">
          <h2 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-6 font-medium">Section Visibility</h2>
          <p className="text-xs text-luxury-white/30 mb-4">Toggle sections to show or hide them on the homepage</p>
          <div className="space-y-3">
            {[
              { key: 'hero' as const, label: 'Hero Carousel' },
              { key: 'explore' as const, label: 'Explore Categories' },
              { key: 'about' as const, label: 'About Us' },
              { key: 'certificates' as const, label: 'Certificates' },
              { key: 'instagram' as const, label: 'Instagram' },
            ].map((section) => (
              <label key={section.key} className="flex items-center gap-3 cursor-pointer">
                <div className={`w-10 h-5 rounded-full transition-all duration-300 flex items-center px-0.5 ${
                  settings.sections[section.key] ? 'bg-luxury-silver' : 'bg-luxury-gunmetal'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-luxury-black transition-all duration-300 ${
                    settings.sections[section.key] ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
                <input
                  type="checkbox"
                  checked={settings.sections[section.key]}
                  onChange={() => toggleSection(section.key)}
                  className="hidden"
                />
                <span className="text-sm text-luxury-white/70">{section.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Admin Password */}
        <section className="bg-luxury-charcoal/40 border border-luxury-gunmetal/20 p-6 md:p-8">
          <h2 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-6 font-medium">Security</h2>
          <button
            type="button"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-luxury-silver/60 hover:text-luxury-silver transition-colors"
          >
            {showPasswordForm ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>Change Admin Password</span>
          </button>

          {showPasswordForm && (
            <div className="mt-5 space-y-4 max-w-md">
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-white/40 mb-2">Current Password</label>
                <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-white/40 mb-2">New Password</label>
                <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-luxury-white/40 mb-2">Confirm New Password</label>
                <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="w-full bg-luxury-black border border-luxury-gunmetal/40 px-4 py-2.5 text-luxury-white focus:outline-none focus:border-luxury-silver/30 text-sm" />
              </div>
              <button
                type="button"
                onClick={handlePasswordChange}
                className="px-5 py-2.5 bg-luxury-white text-luxury-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-luxury-silver transition-all duration-300"
              >
                Update Password
              </button>
            </div>
          )}
        </section>

        {/* Save Button (bottom) */}
        <div className="flex justify-end pt-4 pb-10">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 bg-luxury-white text-luxury-black text-sm tracking-[0.15em] uppercase font-medium hover:bg-luxury-silver disabled:opacity-50 transition-all duration-300"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
