'use client';

import { SearchBar } from '@/components/SearchBar';
import { AppSelect, AppSelectOption } from '@/components/AppSelect';
import './shop-toolbar.css';

interface ShopToolbarProps {
  title: string;
  subtitle?: string;
  searchQuery?: string;
  searchPlaceholder?: string;
  onSearch: (query: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  sortOptions: AppSelectOption[];
}

export function ShopToolbar({
  title,
  subtitle,
  searchQuery = '',
  searchPlaceholder = 'Search products...',
  onSearch,
  sort,
  onSortChange,
  sortOptions,
}: ShopToolbarProps) {
  return (
    <div className="shop-toolbar">
      <div className="shop-toolbar__header">
        <h1 className="shop-toolbar__title">{title}</h1>
        {subtitle && (
          <p className="shop-toolbar__subtitle">{subtitle}</p>
        )}
      </div>

      <div className="shop-toolbar__controls">
        <div className="shop-toolbar__search-wrap">
          <SearchBar
            variant="toolbar"
            placeholder={searchPlaceholder}
            defaultValue={searchQuery}
            onSearch={onSearch}
          />
        </div>

        <div className="shop-toolbar__sort-wrap">
          <span className="shop-toolbar__sort-label">Sort by</span>
          <AppSelect
            value={sort}
            onValueChange={onSortChange}
            options={sortOptions}
            className="w-full"
            triggerClassName="w-full"
          />
        </div>
      </div>
    </div>
  );
}
