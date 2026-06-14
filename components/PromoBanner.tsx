'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { bannerService } from '@/lib/services';
import { Banner } from '@/lib/types';
import { resolveImageUrl } from '@/lib/image-url';
import './promo-banner.css';

const AUTOPLAY_MS = 5500;

export function PromoBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    bannerService
      .getActive()
      .then((list) => setBanners(list.filter((b) => b.isActive && b.image)))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    setProgress(0);
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
    if (!api || banners.length <= 1) return;
    const tick = 50;
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = p + (tick / AUTOPLAY_MS) * 100;
        if (next >= 100) {
          if (api.canScrollNext()) api.scrollNext();
          else api.scrollTo(0);
          return 0;
        }
        return next;
      });
    }, tick);
    return () => clearInterval(timer);
  }, [api, banners.length, current]);

  if (loading) {
    return (
      <section className="promo-banner" aria-label="Loading promotions">
        <div className="promo-banner-skeleton" />
      </section>
    );
  }

  if (banners.length === 0) return null;

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
    setProgress(0);
  };

  return (
    <section className="promo-banner anim-scale-in" aria-label="Promotions">
      <Carousel
        setApi={setApi}
        opts={{ loop: banners.length > 1, align: 'start' }}
        className="promo-banner__carousel"
      >
        <CarouselContent className="promo-banner__content">
          {banners.map((banner) => {
            const href = banner.link?.trim() || '/user/products';
            const isExternal = href.startsWith('http');
            const slide = (
              <>
                <img src={resolveImageUrl(banner.image)} alt={banner.title} />
                <div className="promo-banner-caption">
                  <h2>{banner.title}</h2>
                  {banner.description && <p>{banner.description}</p>}
                </div>
              </>
            );

            return (
              <CarouselItem key={banner._id} className="promo-banner__item">
                {isExternal ? (
                  <a
                    href={href}
                    className="promo-banner-slide"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {slide}
                  </a>
                ) : (
                  <Link href={href} className="promo-banner-slide">
                    {slide}
                  </Link>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              className="promo-banner-nav promo-banner-nav--prev"
              aria-label="Previous banner"
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="promo-banner-nav promo-banner-nav--next"
              aria-label="Next banner"
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </Carousel>

      {banners.length > 1 && (
        <div className="promo-banner-footer">
          <div className="promo-banner-dots">
            {banners.map((b, i) => (
              <button
                key={b._id}
                type="button"
                className={`promo-banner-dot ${i === current ? 'promo-banner-dot--active' : ''}`}
                aria-label={`Show banner ${i + 1}`}
                aria-current={i === current ? 'true' : undefined}
                onClick={() => scrollTo(i)}
              />
            ))}
          </div>
          <div className="promo-banner-progress" aria-hidden>
            <div
              className="promo-banner-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
