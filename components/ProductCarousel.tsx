'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import './product-carousel.css';
import { formatPrice } from '@/lib/currency';

export interface CarouselProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  rating: number;
  reviews: number;
}

interface ProductCarouselProps {
  title?: string;
  products: CarouselProduct[];
  onAddToCart?: (id: string) => void;
}

export function ProductCarousel({
  title = 'Featured Products',
  products,
  onAddToCart,
}: ProductCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    setSnapCount(api.scrollSnapList().length);
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api || products.length <= 1) return;
    const timer = setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 6000);
    return () => clearInterval(timer);
  }, [api, products.length]);

  if (products.length === 0) return null;

  return (
    <div className="product-carousel anim-fade-up">
      <div
        className={`product-carousel__header ${!title ? 'product-carousel__header--nav-only' : ''}`}
      >
        {title ? <h2 className="product-carousel__title">{title}</h2> : <span />}
        <div className="product-carousel__nav">
          <button
            type="button"
            className="product-carousel__nav-btn"
            aria-label="Previous products"
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="product-carousel__nav-btn"
            aria-label="Next products"
            onClick={() => api?.scrollNext()}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ align: 'start', loop: products.length > 4, dragFree: true }}
        className="product-carousel__viewport"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <article className="product-carousel__card">
                <div className="product-carousel__image-wrap">
                  {product.image.startsWith('http') ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      {product.image || '🎮'}
                    </div>
                  )}
                  {product.discount > 0 && (
                    <span className="product-carousel__badge">-{product.discount}%</span>
                  )}
                </div>
                <div className="product-carousel__body">
                  <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-3 text-yellow-500 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                    ))}
                    <span className="text-muted-foreground ml-1">({product.reviews})</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Button
                    className="w-full mt-auto"
                    size="sm"
                    onClick={() => onAddToCart?.(product.id)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {snapCount > 1 && (
        <div className="product-carousel__dots">
          {Array.from({ length: snapCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`product-carousel__dot ${i === current ? 'product-carousel__dot--active' : ''}`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
