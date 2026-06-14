'use client';

import { useEffect, useState } from 'react';
import {
  FolderOpen,
  Plus,
  Loader2,
  Trash2,
  Tag,
  Sparkles,
  Layers,
} from 'lucide-react';
import { categoryService } from '@/lib/services';
import { Category } from '@/lib/types';
import { useAppPopup } from '@/contexts/AppPopupContext';
import { AnimateIn } from '@/components/AnimateIn';
import './categories.css';

const CATEGORY_ICONS: Record<string, string> = {
  'action figures': '🚀',
  'board games': '🎲',
  puzzles: '🧩',
  'video games': '🎮',
  dolls: '🧸',
  outdoor: '⚽',
  educational: '📚',
  vehicles: '🚗',
};

function getCategoryIcon(name: string): string {
  const key = name.trim().toLowerCase();
  return CATEGORY_ICONS[key] ?? '📦';
}

export default function CategoriesPage() {
  const popup = useAppPopup();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const load = () =>
    categoryService
      .getAll()
      .then(setCategories)
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      popup.warning('Please enter a category name.');
      return;
    }
    setSaving(true);
    try {
      await categoryService.create({
        name: name.trim(),
        description: description.trim(),
        isActive: true,
      });
      popup.success(`"${name.trim()}" was added to your catalog.`, 'Category created');
      setName('');
      setDescription('');
      load();
    } catch {
      popup.error('Could not create category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, categoryName: string) => {
    const ok = await popup.confirm(
      `Remove "${categoryName}"? Products in this category may be affected.`,
      'Delete category?',
    );
    if (!ok) return;
    try {
      await categoryService.remove(id);
      popup.success('The category has been removed.', 'Deleted');
      load();
    } catch {
      popup.error('Could not delete category. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeCount = categories.filter((c) => c.isActive !== false).length;

  return (
    <div className="categories-page">
      <section className="categories-hero anim-scale-in">
        <div className="categories-hero__inner">
          <div>
            <h1 className="categories-hero__title">Categories</h1>
            <p className="categories-hero__subtitle">
              Organize your product catalog with clear groups customers can browse and filter by.
            </p>
          </div>
          <div className="categories-hero__stats">
            <div className="categories-stat">
              <div className="categories-stat__value">{categories.length}</div>
              <div className="categories-stat__label">Total</div>
            </div>
            <div className="categories-stat">
              <div className="categories-stat__value">{activeCount}</div>
              <div className="categories-stat__label">Active</div>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <div className="categories-strip anim-fade-in">
          {categories.map((c) => (
            <div key={c._id} className="categories-strip__chip">
              <span>{getCategoryIcon(c.name)}</span>
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="categories-layout">
        <AnimateIn variant="fade-up" className="categories-form-card">
          <div className="categories-form-card__head">
            <div className="categories-form-card__icon">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2>New category</h2>
              <p>Add a group for your products</p>
            </div>
          </div>

          <div className="categories-field">
            <label htmlFor="cat-name">Category name</label>
            <input
              id="cat-name"
              placeholder="e.g. Board Games"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <div className="categories-field">
            <label htmlFor="cat-desc">Description</label>
            <input
              id="cat-desc"
              placeholder="Short description for shoppers"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          <button
            type="button"
            className="categories-submit"
            onClick={handleCreate}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Category
              </>
            )}
          </button>
        </AnimateIn>

        <div>
          <div className="categories-list-header anim-fade-in">
            <h2>
              <Layers className="w-5 h-5 inline-block mr-2 align-text-bottom text-primary" />
              Your categories
            </h2>
            <span>{categories.length} {categories.length === 1 ? 'item' : 'items'}</span>
          </div>

          {categories.length === 0 ? (
            <div className="categories-empty anim-fade-up">
              <div className="categories-empty__icon">
                <FolderOpen className="w-10 h-10" />
              </div>
              <h3>No categories yet</h3>
              <p>Create your first category using the form — it will appear here as a card.</p>
            </div>
          ) : (
            <div className="categories-grid anim-stagger-children">
              {categories.map((c, index) => (
                <article
                  key={c._id}
                  className={`categories-card categories-card--accent-${index % 6} anim-hover-lift`}
                >
                  <button
                    type="button"
                    className="categories-card__delete"
                    aria-label={`Delete ${c.name}`}
                    onClick={() => handleDelete(c._id, c.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="categories-card__accent">{getCategoryIcon(c.name)}</div>
                  <div className="categories-card__body">
                    <h3 className="categories-card__name">{c.name}</h3>
                    <p className="categories-card__desc">
                      {c.description || 'No description provided.'}
                    </p>
                    <div className="categories-card__meta">
                      <span className="categories-card__badge">
                        <Sparkles className="w-3 h-3" />
                        Active
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Catalog
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
