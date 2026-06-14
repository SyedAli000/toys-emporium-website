'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { decodeToken } from '@/lib/auth';
import { AlertCircle, Loader2, Shield, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const ADMIN_ROLES = ['admin', 'super_admin'];
const cookieOptions = { expires: 7, path: '/' as const };

export default function ManagerAdminLoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  if (!authLoading && user?.role !== 'manager') {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      router.replace('/admin');
    } else {
      router.replace('/manager');
    }
    return null;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post<{ token: string; user: { role: string } }>(
        '/auth/login',
        { email: data.email, password: data.password },
      );

      const role = response.user.role;
      const token = response.token;

      if (!ADMIN_ROLES.includes(role)) {
        setError('This account does not have admin access.');
        return;
      }

      Cookies.set('auth_token', token, cookieOptions);
      const session = decodeToken(token);
      if (!session || !ADMIN_ROLES.includes(session.role)) {
        setError('Could not start admin session. Please try again.');
        return;
      }

      window.location.href = '/admin';
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(
        axiosErr.response?.data?.message || 'Login failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Link
        href="/manager"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Manager Panel
      </Link>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-sm text-muted-foreground">
              Sign in with admin credentials
            </p>
          </div>
        </div>

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
              placeholder="admin@example.com"
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
              'Sign In to Admin Panel'
            )}
          </Button>
        </form>
      </Card>

      <div className="mt-6 bg-teal-50 rounded-xl p-4 border border-teal-200">
        <p className="text-sm font-medium text-foreground mb-1">Demo</p>
        <p className="text-sm text-muted-foreground">
          <code className="bg-white px-2 py-0.5 rounded">admin@example.com</code>
          {' / '}
          <code className="bg-white px-2 py-0.5 rounded">password123</code>
        </p>
      </div>
    </div>
  );
}
