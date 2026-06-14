'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ShopToolbar } from '@/components/ShopToolbar';
import { productService, cartService } from '@/lib/services';
import { Product } from '@/lib/types';
import { splitProductsForStore } from '@/lib/product-pricing';
import { useCart } from '@/contexts/CartContext';
import { PromoBanner } from '@/components/PromoBanner';
import { FlashSaleSection } from '@/components/FlashSaleSection';
import { JustForYouGrid } from '@/components/JustForYouGrid';
import { PRODUCT_SORT_OPTIONS } from '@/components/AppSelect';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [flashSale, setFlashSale] = useState<Product[]>([]);
  const [regular, setRegular] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('latest');
  const [search, setSearch] = useState(initialSearch);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { refreshCart, showAddToCartPopup } = useCart();

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    loadProducts();
  }, [sort, search]);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = { limit: '50' };
      if (sort && sort !== 'latest') params.sort = sort;
      if (search) params.search = search;
      const res = await productService.getAll(params);
      const { flashSale: flash, regular: rest } = splitProductsForStore(res.products);
      setFlashSale(flash);
      setRegular(rest);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    setActionLoading(`cart-${product._id}`);
    try {
      await cartService.add(product._id);
      await refreshCart();
      showAddToCartPopup(product.name);
    } catch {
      setActionLoading(null);
      return;
    } finally {
      setActionLoading(null);
    }
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
      <PromoBanner />

      <ShopToolbar
        title="Shop All Products"
        subtitle={
          search
            ? `Showing results for "${search}"`
            : 'Flash sale deals first — then everything else'
        }
        searchQuery={search}
        onSearch={setSearch}
        sort={sort}
        onSortChange={setSort}
        sortOptions={PRODUCT_SORT_OPTIONS}
      />

      {error && <p className="text-destructive">{error}</p>}

      <FlashSaleSection products={flashSale} />

      <JustForYouGrid
        products={regular}
        title="Just For You"
        onAddToCart={handleAddToCart}
        actionLoading={actionLoading}
      />

      {!loading && flashSale.length === 0 && regular.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No products found.</p>
      )}
    </div>
  );
}
