'use client';

import { useId, useRef, useState } from 'react';
import { ImagePlus, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadService } from '@/lib/services/upload.service';
import { resolveImageUrl } from '@/lib/image-url';
import './image-upload.css';

type MultiImageUploadFieldProps = {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
};

export function MultiImageUploadField({
  label = 'Product images',
  values,
  onChange,
  max = 6,
}: MultiImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File | undefined) => {
    if (!file || values.length >= max) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      onChange([...values, url]);
    } catch {
      setError('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="image-upload-wrap">
      <label className="image-upload-label">{label}</label>
      <p className="text-xs text-muted-foreground mb-2">
        Add up to {max} images. First image is the main thumbnail.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
        {values.map((url, i) => (
          <div key={`${url}-${i}`} className="relative aspect-square rounded-lg border overflow-hidden bg-muted">
            <img src={resolveImageUrl(url)} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
              onClick={() => removeAt(i)}
              aria-label="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground text-[10px] text-center py-0.5">
                Main
              </span>
            )}
          </div>
        ))}
        {values.length < max && (
          <button
            type="button"
            className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-6 h-6" />
                <span className="text-xs">Add</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading || values.length >= max}
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading || values.length >= max}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-4 h-4 mr-2" />
        Browse from computer
      </Button>
      {error && <p className="image-upload-error mt-2">{error}</p>}
    </div>
  );
}
