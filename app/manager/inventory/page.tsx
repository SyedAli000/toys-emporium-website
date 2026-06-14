'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchBar } from '@/components/SearchBar';
import { Package, Loader2, Pencil, Shield, RotateCcw } from 'lucide-react';
import { productService } from '@/lib/services';
import { Product } from '@/lib/types';
import { resolveImageUrl } from '@/lib/image-url';
import { useAppPopup } from '@/contexts/AppPopupContext';

export default function InventoryPage() {
  const popup = useAppPopup();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [policyForm, setPolicyForm] = useState({
    hasReturn: false,
    hasWarranty: false,
    returnPolicy: '14 days easy return',
    warrantyText: '1 Year Warranty',
  });

  const load = () => {
    setLoading(true);
    const params: Record<string, string> = { limit: '100', activeOnly: 'false' };
    if (search) params.search = search;
    productService
      .getAll(params)
      .then((r) => setProducts(r.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [search]);

  const openEdit = (p: Product) => {
    setEditing(p);
    setPolicyForm({
      hasReturn: Boolean(p.hasReturn),
      hasWarranty: Boolean(p.hasWarranty),
      returnPolicy: p.returnPolicy || '14 days easy return',
      warrantyText: p.warrantyText || '1 Year Warranty',
    });
  };

  const savePolicies = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await productService.update(editing._id, {
        hasReturn: policyForm.hasReturn,
        hasWarranty: policyForm.hasWarranty,
        returnPolicy: policyForm.returnPolicy,
        warrantyText: policyForm.warrantyText,
      });
      popup.success('Return & warranty updated for customers.', 'Saved');
      setEditing(null);
      load();
    } catch {
      popup.error('Could not save. Ensure you are logged in as manager.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
        <p className="text-muted-foreground mt-2">
          Set return &amp; warranty — shown on the product detail page for customers
        </p>
      </div>

      <SearchBar
        variant="inline"
        placeholder="Search products..."
        defaultValue={search}
        onChange={setSearch}
      />

      {editing && (
        <Card className="p-6 max-w-lg border-primary/30 shadow-lg space-y-4">
          <h2 className="font-bold text-lg">Return &amp; Warranty — {editing.name}</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={policyForm.hasReturn}
              onChange={(e) => setPolicyForm({ ...policyForm, hasReturn: e.target.checked })}
              className="w-4 h-4"
            />
            <RotateCcw className="w-4 h-4 text-primary" />
            <span className="font-medium">Enable return policy</span>
          </label>
          {policyForm.hasReturn && (
            <Input
              placeholder="Return policy text"
              value={policyForm.returnPolicy}
              onChange={(e) => setPolicyForm({ ...policyForm, returnPolicy: e.target.value })}
            />
          )}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={policyForm.hasWarranty}
              onChange={(e) => setPolicyForm({ ...policyForm, hasWarranty: e.target.checked })}
              className="w-4 h-4"
            />
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-medium">Enable warranty</span>
          </label>
          {policyForm.hasWarranty && (
            <Input
              placeholder="Warranty text"
              value={policyForm.warrantyText}
              onChange={(e) => setPolicyForm({ ...policyForm, warrantyText: e.target.value })}
            />
          )}
          <div className="flex gap-2">
            <Button onClick={savePolicies} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr>
              <th className="text-left p-4 font-semibold">Image</th>
              <th className="text-left p-4 font-semibold">Product</th>
              <th className="text-left p-4 font-semibold">Stock</th>
              <th className="text-left p-4 font-semibold">Return</th>
              <th className="text-left p-4 font-semibold">Warranty</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const img = p.images?.[0];
              return (
                <tr key={p._id} className="border-b border-border">
                  <td className="p-4">
                    {img ? (
                      <img
                        src={resolveImageUrl(img)}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover border border-border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-lg">
                        🎮
                      </div>
                    )}
                  </td>
                  <td className="p-4">{p.name}</td>
                  <td className={`p-4 ${p.stock <= 5 ? 'text-destructive font-bold' : ''}`}>
                    {p.stock}
                  </td>
                  <td className="p-4">{p.hasReturn ? 'Yes' : '—'}</td>
                  <td className="p-4">{p.hasWarranty ? 'Yes' : '—'}</td>
                  <td className="p-4">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                      <Pencil className="w-4 h-4 mr-1" />
                      Policies
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      {products.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground">No products</h2>
        </Card>
      )}
    </div>
  );
}
