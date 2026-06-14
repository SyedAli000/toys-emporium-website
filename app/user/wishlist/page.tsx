'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { wishlistService, cartService } from '@/lib/services';
import { resolveImageUrl } from '@/lib/image-url';
import { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { useAppPopup } from '@/contexts/AppPopupContext';

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshCart, showAddToCartPopup } = useCart();
  const popup = useAppPopup();

  const load = async () => {
    setLoading(true);
    try {
      const res = await wishlistService.get();
      setProducts((res.products as Product[]) || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (productId: string) => {
    await wishlistService.remove(productId);
    load();
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await cartService.add(product._id);
      await refreshCart();
      showAddToCartPopup(product.name);
    } catch {
      popup.error('Could not add to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
        <div className="flex flex-col items-center justify-center py-16">
          <Heart className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
          <Link href="/user/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          <Card key={item._id} className="overflow-hidden hover:shadow-lg transition group">
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 aspect-square flex items-center justify-center relative">
              {item.images?.[0] ? (
                <img
                  src={resolveImageUrl(item.images[0])}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">🎮</div>
              )}
              <button
                onClick={() => handleRemove(item._id)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md"
              >
                <Trash2 className="w-5 h-5 text-destructive" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground line-clamp-2">{item.name}</h3>
              <p className="text-xl font-bold text-primary mt-3">
                ${Number(item.price).toFixed(2)}
              </p>
              <Button className="w-full mt-4" size="sm" onClick={() => handleAddToCart(item)}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
