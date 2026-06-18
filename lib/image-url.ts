function getApiRoot(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
    'http://localhost:3001'
  );
}

/** Turn stored image path or URL into a browser-loadable src. */
export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';

  const apiRoot = getApiRoot();

  // Rewrite legacy full URLs (e.g. http://localhost:3001/uploads/...) to the
  // configured API host so HTTPS sites do not block mixed-content image loads.
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const { pathname } = new URL(url);
      if (pathname.startsWith('/uploads/')) {
        return `${apiRoot}${pathname}`;
      }
    } catch {
      return url;
    }
    return url;
  }

  const path = url.startsWith('/') ? url : `/${url}`;
  return `${apiRoot}${path}`;
}
