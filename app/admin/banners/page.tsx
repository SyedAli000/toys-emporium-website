'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUploadField } from '@/components/ImageUploadField';
import { resolveImageUrl } from '@/lib/image-url';
import { ImageIcon, Plus, Loader2, Trash2 } from 'lucide-react';
import { bannerService } from '@/lib/services';
import { Banner } from '@/lib/types';
import '@/components/admin-form.css';
import { useAppPopup } from '@/contexts/AppPopupContext';

export default function BannersPage() {
  const popup = useAppPopup();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
  });

  const load = () =>
    bannerService
      .getAll()
      .then(setBanners)
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.image) {
      popup.warning('Please add a title and upload a banner image.');
      return;
    }
    setSaving(true);
    try {
      await bannerService.create({
        title: form.title,
        description: form.description,
        image: form.image,
        link: form.link,
        isActive: true,
        position: banners.length,
      });
      setForm({ title: '', description: '', image: '', link: '' });
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await popup.confirm('This banner will be permanently removed.', 'Delete banner?');
    if (!ok) return;
    await bannerService.remove(id);
    load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Banners</h1>
        <p className="text-muted-foreground mt-2">Manage promotional banners</p>
      </div>

      <div className="admin-form-center">
      <Card className="admin-form-card space-y-4">
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <ImageUploadField
          label="Banner image"
          aspect="banner"
          value={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
        />
        <Input
          placeholder="Link URL (optional)"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />
        <Button onClick={handleCreate} disabled={saving} className="w-full">
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Add Banner
        </Button>
      </Card>
      </div>

      {banners.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Banners</h2>
        </Card>
      ) : (
        <div className="grid gap-4">
          {banners.map((b) => (
            <Card key={b._id} className="p-4 flex gap-4 items-center">
              <img
                src={resolveImageUrl(b.image)}
                alt={b.title}
                className="w-40 h-20 object-cover rounded-lg border border-border"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(b._id)}
                className="text-destructive"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
