import { AuthToken, UserRole } from './types';

/** Browser-safe JWT decode (jsonwebtoken fails in client bundles). */
export function decodeToken(token: string): AuthToken | null {
  try {
    const segment = token.split('.')[1];
    if (!segment) return null;

    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json =
      typeof window !== 'undefined'
        ? atob(padded)
        : Buffer.from(padded, 'base64').toString('utf8');

    const payload = JSON.parse(json) as {
      userId?: string;
      sub?: string;
      email?: string;
      role?: string;
      iat?: number;
      exp?: number;
    };

    const role = payload.role as UserRole | undefined;
    const userId = payload.userId ?? payload.sub;
    if (!userId || !role || !payload.email) {
      return null;
    }

    return {
      userId: String(userId),
      email: payload.email,
      role,
      iat: payload.iat ?? 0,
      exp: payload.exp ?? 0,
    };
  } catch {
    return null;
  }
}
