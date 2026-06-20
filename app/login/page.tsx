'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/PasswordInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { decodeToken } from '@/lib/auth';
import { getDashboardPath, isStaffRole } from '@/lib/auth-redirect';
import { AlertCircle, Loader2, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const cookieOptions = { expires: 7, path: '/' as const };

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      const session = decodeToken(token);
      if (session && isStaffRole(session.role)) {
        router.replace(getDashboardPath(session.role));
        return;
      }
      if (session?.role === 'customer') {
        Cookies.remove('auth_token', { path: '/' });
      }
    }
    setCheckingSession(false);
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post<{ token: string; user: { role: string } }>(
        '/auth/login',
        { email: data.email, password: data.password },
      );

      const session = decodeToken(response.token);

      if (!session) {
        setError('Could not start session. Please try again.');
        return;
      }

      if (!isStaffRole(session.role)) {
        setError(
          'This login is for admin and manager staff only. Customers can shop without an account.',
        );
        return;
      }

      Cookies.set('auth_token', response.token, cookieOptions);
      window.location.href = getDashboardPath(session.role);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
        code?: string;
        message?: string;
      };
      if (!axiosErr.response) {
        setError(
          'Cannot reach the backend API. Start it with: cd toys-emporium-backend && yarn start:dev',
        );
        return;
      }
      setError(
        axiosErr.response?.data?.message || 'Login failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center w-full">
          <Logo
            href="/"
            centered
            className="mb-8 sm:mb-10"
            imageClassName="w-40 sm:w-48 md:w-56"
          />
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-lg p-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Staff Login</h1>
          </div>
          <p className="text-muted-foreground mb-4">
            Admin and manager only. Enter your credentials to open your panel.
          </p>

          <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 mb-6">
            Local dev: ensure backend is running on port 3001 (
            <code className="text-xs">yarn start:dev</code> in backend folder).
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="admin@toys-emporium.com"
                {...register('email')}
                className="w-full"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <PasswordInput
                placeholder="••••••••"
                {...register('password')}
                className="w-full"
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In to Panel'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/" className="text-primary font-semibold hover:underline">
              Back to shop
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
