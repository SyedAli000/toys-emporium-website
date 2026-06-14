'use client';

import { useId, useRef, useState } from 'react';
import { ImagePlus, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadService } from '@/lib/services/upload.service';
import { resolveImageUrl } from '@/lib/image-url';
import './image-upload.css';

type ImageUploadFieldProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: 'square' | 'banner';
};

export function ImageUploadField({
  label = 'Image',
  value,
  onChange,
  aspect = 'square',
}: ImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  const previewSrc = localPreview || (value ? resolveImageUrl(value) : '');

  const handleFile = async (file: File | undefined) => {
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type) && !file.type.startsWith('image/')) {
      setError('Please choose a JPG, PNG, GIF, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.');
      return;
    }

    setError('');
    setFileName(file.name);
    setUploading(true);

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    try {
      const url = await uploadService.uploadImage(file);
      onChange(url);
      setError('');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(
        axiosErr.response?.data?.message ||
          'Upload failed. Log in as admin and ensure the backend is running on port 3001.',
      );
      onChange('');
      setFileName('');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
      setLocalPreview(null);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    void handleFile(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploading) return;
    const file = e.dataTransfer.files?.[0];
    void handleFile(file);
  };

  const clearImage = () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    setFileName('');
    onChange('');
    setError('');
  };

  return (
    <div className="image-upload-wrap">
      <label htmlFor={inputId} className="image-upload-label">
        {label}
      </label>

      <div
        className={`image-upload-dropzone ${uploading ? 'image-upload-dropzone--busy' : ''}`}
        style={aspect === 'banner' ? { aspectRatio: '3 / 1', maxWidth: '100%' } : undefined}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="image-upload-file-overlay"
          disabled={uploading}
          onChange={onInputChange}
          aria-label={`Choose ${label} from your computer`}
        />

        <div className="image-upload-preview-content">
          {uploading ? (
            <div className="image-upload-placeholder">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span>Uploading…</span>
            </div>
          ) : previewSrc ? (
            <img src={previewSrc} alt="Preview" className="image-upload-preview-img" />
          ) : (
            <div className="image-upload-placeholder">
              <ImagePlus className="w-8 h-8 opacity-50" />
              <span className="font-medium">Click anywhere here to pick a photo</span>
              <span className="text-xs">or drag and drop from your computer</span>
            </div>
          )}
        </div>
      </div>

      <div className="image-upload-actions">
        <Button
          type="button"
          variant="default"
          className="image-upload-browse-btn"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Browse from computer
        </Button>
        {value && (
          <Button type="button" variant="outline" size="sm" onClick={clearImage}>
            <X className="w-4 h-4 mr-1" />
            Remove
          </Button>
        )}
      </div>

      {fileName && !error && (
        <p className="image-upload-filename">
          Selected: <strong>{fileName}</strong>
          {value ? ' — uploaded' : ''}
        </p>
      )}
      <p className="image-upload-hint">JPG, PNG, GIF or WebP — max 5 MB</p>
      {error && <p className="image-upload-error">{error}</p>}
    </div>
  );
}
