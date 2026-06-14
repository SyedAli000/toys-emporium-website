'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './search-bar.css';

type SearchBarVariant = 'hero' | 'nav' | 'inline' | 'toolbar';

interface SearchBarProps {
  variant?: SearchBarVariant;
  placeholder?: string;
  defaultValue?: string;
  /** Called on submit; if omitted, navigates to /user/products?search=... */
  onSearch?: (query: string) => void;
  /** For inline variant: live change callback */
  onChange?: (query: string) => void;
  /** Show quick-search chips below hero bar */
  showChips?: boolean;
  className?: string;
}

const QUICK_SEARCHES = ['Action Figures', 'Board Games', 'Puzzles', 'Video Games'];

export function SearchBar({
  variant = 'hero',
  placeholder = 'Search toys, games, puzzles...',
  defaultValue = '',
  onSearch,
  onChange,
  showChips = variant === 'hero',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (variant !== 'nav' || !navOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setNavOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant, navOpen]);

  useEffect(() => {
    if (navOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [navOpen]);

  const submit = (value: string) => {
    const trimmed = value.trim();
    const allowEmpty = variant === 'toolbar' && onSearch;

    if (!trimmed && !allowEmpty) return;

    if (onSearch) {
      onSearch(trimmed);
    } else if (trimmed) {
      router.push(`/user/products?search=${encodeURIComponent(trimmed)}`);
    }

    if (variant === 'nav') setNavOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(query);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && variant === 'nav') {
      setNavOpen(false);
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    onChange?.(value);
  };

  /* ── Nav (expandable icon) ── */
  if (variant === 'nav') {
    return (
      <div
        ref={navRef}
        className={`search-bar search-bar--nav ${navOpen ? 'is-open' : ''} ${className}`}
      >
        <button
          type="button"
          className="search-bar__toggle"
          onClick={() => setNavOpen((o) => !o)}
          aria-label="Search products"
          aria-expanded={navOpen}
        >
          <Search className="w-5 h-5" />
        </button>

        <div className="search-bar__dropdown">
          <form className="search-bar__dropdown-inner" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="search-bar__input"
              placeholder={placeholder}
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button type="submit" className="search-bar__submit" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Toolbar (shop page — compact, icon-only submit) ── */
  if (variant === 'toolbar') {
    return (
      <form
        className={`search-bar search-bar--toolbar ${className}`}
        onSubmit={handleSubmit}
      >
        <div className="search-bar__shell">
          <Search className="search-bar__icon w-4 h-4" />
          <input
            type="text"
            className="search-bar__input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleChange(e.target.value)}
          />
          <button type="submit" className="search-bar__submit" aria-label="Search">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>
    );
  }

  /* ── Inline (admin / manager) ── */
  if (variant === 'inline') {
    return (
      <form
        className={`search-bar search-bar--inline ${className}`}
        onSubmit={handleSubmit}
      >
        <div className="search-bar__inner">
          <div className="search-bar__field-wrap">
            <Search className="search-bar__icon w-4 h-4" />
            <input
              type="text"
              className="search-bar__input"
              placeholder={placeholder}
              value={query}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
          <button type="submit" className="search-bar__submit">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </form>
    );
  }

  /* ── Hero (homepage) ── */
  return (
    <div className={`search-bar search-bar--hero ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="search-bar__shell">
          <div className="search-bar__inner">
            <Search className="search-bar__icon w-5 h-5" />
            <input
              type="text"
              className="search-bar__input"
              placeholder={placeholder}
              value={query}
              onChange={(e) => handleChange(e.target.value)}
            />
            <button type="submit" className="search-bar__submit">
              Search
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {showChips && (
        <div className="search-bar__chips">
          {QUICK_SEARCHES.map((chip) => (
            <button
              key={chip}
              type="button"
              className="search-bar__chip"
              onClick={() => submit(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
