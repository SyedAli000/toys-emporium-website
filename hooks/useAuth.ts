import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { decodeToken } from '@/lib/auth';
import { AuthToken } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<AuthToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
      } else {
        // Token is invalid, remove it
        Cookies.remove('auth_token', { path: '/' });
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    Cookies.remove('auth_token', { path: '/' });
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = !!user;
  const canAccessManager = user?.role === 'manager' || user?.role === 'admin' || user?.role === 'super_admin';
  const canAccessAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    canAccessManager,
    canAccessAdmin,
  };
}
