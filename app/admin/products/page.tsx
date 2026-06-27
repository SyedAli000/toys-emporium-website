'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUploadField } from '@/components/ImageUploadField';
import { MultiImageUploadField } from '@/components/MultiImageUploadField';
import { resolveImageUrl } from '@/lib/image-url';
import { getDiscountPercent, getSalePrice, discountAmountToPercent, discountPercentToAmount } from '@/lib/product-pricing';
import { formatPrice } from '@/lib/currency';
import { Package, Plus, Loader2, Trash2, Zap, Pencil } from 'lucide-react';
import { productService, categoryService } from '@/lib/services';
import { Product, Category } from '@/lib/types';
import '@/components/admin-form.css';
import { AppSelect } from '@/components/AppSelect';
import { useAppPopup } from '@/contexts/AppPopupContext';

const CATEGORY_NONE = '__none__';

const emptyForm = () => ({
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  images: [] as string[],
  isFlashSale: false,
  discountAmount: '',
});

export default function AdminProductsPage() {
  const popup = useAppPopup();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());

  const load = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        productService.getAll({ limit: '100', activeOnly: 'false' }),
        categoryService.getAll(),
      ]);
      setProducts(p.products);
      setCategories(c);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    const categoryId =
      typeof product.category === 'string'
        ? product.category
        : (product.category as { _id?: string })?._id || '';
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
      category: categoryId,
      images: product.images || [],
      isFlashSale: Boolean(product.isFlashSale),
      discountAmount: String(
        discountPercentToAmount(getDiscountPercent(product), Number(product.price)),
      ),
    });
    setShowForm(true);
  };

  const originalPrice = Number(form.price) || 0;
  const discountAmount = Math.max(0, Number(form.discountAmount) || 0);
  const calculatedDiscountPercent = discountAmountToPercent(discountAmount, originalPrice);
  const calculatedSalePrice =
    originalPrice > 0 && discountAmount > 0
      ? Math.max(0, Math.round((originalPrice - discountAmount) * 100) / 100)
      : originalPrice;

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      popup.warning('Please fill name, price, and category.');
      return;
    }
    if (discountAmount > originalPrice) {
      popup.warning('Discount amount cannot be greater than original price.');
      return;
    }
    const discount = calculatedDiscountPercent;
    if (form.isFlashSale && discount <= 0) {
      popup.warning('Flash sale products need a discount amount greater than 0.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        category: form.category,
        images: form.images,
        isActive: true,
        isFlashSale: form.isFlashSale,
        discountPercentage: discount,
      } as Partial<Product>;

      if (editingId) {
        await productService.update(editingId, payload);
        popup.success('Product updated successfully.', 'Success');
      } else {
        await productService.create(payload);
        popup.success('Product added to catalog.', 'Success');
      }
      resetForm();
      load();
    } catch {
      popup.error(editingId ? 'Could not update product.' : 'Could not save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await popup.confirm('This product will be permanently removed.', 'Delete product?');
    if (!ok) return;
    await productService.remove(id);
    load();
  };

  const categoryOptions = [
    { value: CATEGORY_NONE, label: 'Select category' },
    ...categories.map((c) => ({ value: c._id, label: c.name })),
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      <div className="admin-page-header">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products Management</h1>
          <p className="text-muted-foreground mt-2">
            Set flash sale + discount % to show products at the top of the customer dashboard
          </p>
        </div>
        <Button onClick={() => (showForm ? resetForm() : openCreate())}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Product'}
        </Button>
      </div>

      {showForm && (
        <div className="admin-form-center">
          <Card className="admin-form-card space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              {editingId ? 'Edit Product' : 'Add Product'}
            </h2>
            <MultiImageUploadField
              label="Product images"
              values={form.images}
              onChange={(images) => setForm({ ...form, images })}
            />
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              placeholder="Original price (MRP)"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <Input
              placeholder="Discount amount (e.g. 200 or 300)"
              type="number"
              min={0}
              value={form.discountAmount}
              onChange={(e) => setForm({ ...form, discountAmount: e.target.value })}
            />
            {originalPrice > 0 && discountAmount > 0 && (
              <p className="text-sm text-muted-foreground -mt-2">
                Calculated discount:{' '}
                <span className="font-semibold text-foreground">{calculatedDiscountPercent}%</span>
                {' · '}
                Sale price:{' '}
                <span className="font-semibold text-primary">{formatPrice(calculatedSalePrice)}</span>
              </p>
            )}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFlashSale}
                onChange={(e) => setForm({ ...form, isFlashSale: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <div>
                <span className="font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#f57224]" />
                  Flash Sale
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Shows in the top Flash Sale row on the customer dashboard (requires discount)
                </p>
              </div>
            </label>
            <Input
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <AppSelect
              value={form.category || CATEGORY_NONE}
              onValueChange={(v) =>
                setForm({ ...form, category: v === CATEGORY_NONE ? '' : v })
              }
              options={categoryOptions}
              placeholder="Select category"
            />
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingId ? (
                'Update Product'
              ) : (
                'Save Product'
              )}
            </Button>
          </Card>
        </div>
      )}

      {!showForm && products.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Products</h2>
        </Card>
      ) : !showForm ? (
        <Card className="overflow-x-auto responsive-table-wrap">
          <table className="w-full min-w-[720px]">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-4 font-semibold">Image</th>
                <th className="text-left p-4 font-semibold">Product</th>
                <th className="text-left p-4 font-semibold">Price</th>
                <th className="text-left p-4 font-semibold">Discount</th>
                <th className="text-left p-4 font-semibold">Flash</th>
                <th className="text-left p-4 font-semibold">Stock</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = p.images?.[0];
                const disc = getDiscountPercent(p);
                return (
                  <tr key={p._id} className="border-b border-border">
                    <td className="p-4">
                      {img ? (
                        <img
                          src={resolveImageUrl(img)}
                          alt={p.name}
                          className="w-14 h-14 rounded-lg object-cover border border-border"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-xl">
                          🎮
                        </div>
                      )}
                    </td>
                    <td className="p-4">{p.name}</td>
                    <td className="p-4">
                      {formatPrice(getSalePrice(p))}
                      {disc > 0 && (
                        <span className="text-xs text-muted-foreground block line-through">
                          {formatPrice(Number(p.price))}
                        </span>
                      )}
                    </td>
                    <td className="p-4">{disc > 0 ? `-${disc}%` : '—'}</td>
                    <td className="p-4">{p.isFlashSale ? 'Yes' : '—'}</td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-primary hover:text-primary/80"
                          type="button"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-destructive"
                          type="button"
                          aria-label={`Delete ${p.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      ) : null}
    </div>
  );
}
