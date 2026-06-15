'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { decodeToken } from '@/lib/auth';
import { getDashboardPath, getRoleLabel } from '@/lib/auth-redirect';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
      if (session) {
        router.replace(getDashboardPath(session.role));
        return;
      }
      Cookies.remove('auth_token', { path: '/' });
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

      Cookies.set('auth_token', response.token, cookieOptions);
      const session = decodeToken(response.token);

      if (!session) {
        Cookies.remove('auth_token', { path: '/' });
        setError('Could not start session. Please try again.');
        return;
      }

      const destination = getDashboardPath(session.role);
      window.location.href = destination;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
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
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">TE</span>
          </div>
          <span className="font-bold text-lg text-foreground">Toys Emporium</span>
        </Link>

        <div className="bg-white rounded-2xl border border-border shadow-lg p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign In</h1>
          <p className="text-muted-foreground mb-8">
            Enter your credentials — you will be redirected to your panel
            automatically based on your role.
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
                placeholder="you@example.com"
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
              <Input
                type="password"
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
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <p className="text-sm font-medium text-foreground mb-3">Demo accounts</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>{getRoleLabel('customer')}:</strong>{' '}
              <code className="bg-white px-2 py-0.5 rounded">demo@example.com</code>
              {' / '}
              <code className="bg-white px-2 py-0.5 rounded">password123</code>
            </p>
            <p>
              <strong>{getRoleLabel('manager')}:</strong>{' '}
              <code className="bg-white px-2 py-0.5 rounded">manager@example.com</code>
              {' / '}
              <code className="bg-white px-2 py-0.5 rounded">password123</code>
            </p>
            <p>
              <strong>{getRoleLabel('admin')}:</strong>{' '}
              <code className="bg-white px-2 py-0.5 rounded">admin@example.com</code>
              {' / '}
              <code className="bg-white px-2 py-0.5 rounded">password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
