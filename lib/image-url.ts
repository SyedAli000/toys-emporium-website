/** Turn stored image path or URL into a browser-loadable src. */
export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const apiRoot =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
    'http://localhost:3001';
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${apiRoot}${path}`;
}
