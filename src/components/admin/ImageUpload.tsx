'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  aspectRatio?: string;
}

export default function ImageUpload({
  currentImage,
  onUpload,
  onRemove,
  label = 'Upload Image',
  aspectRatio = 'aspect-[4/3]',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      setPreview(data.url);
      onUpload(data.url);

      // Reset file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      console.error('Image upload error:', err);
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const displayImage = preview || currentImage;

  return (
    <div>
      <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">
        {label}
      </label>

      <div className={`relative ${aspectRatio} overflow-hidden bg-luxury-charcoal border border-luxury-gunmetal/40`}>
        {displayImage ? (
          <>
            <img
              src={displayImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all duration-300 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="text-white/0 hover:text-white/80 text-xs uppercase tracking-[0.1em] transition-all duration-300"
                disabled={uploading}
              >
                Change
              </button>
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="text-white/0 hover:text-red-400 transition-all duration-300"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="w-full h-full flex flex-col items-center justify-center gap-2 
                     text-luxury-white/30 hover:text-luxury-silver/60 hover:bg-luxury-black/20 
                     transition-all duration-300"
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <ImageIcon size={24} />
            )}
            <span className="text-xs tracking-[0.1em] uppercase">
              {uploading ? 'Uploading...' : 'Click to upload'}
            </span>
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
