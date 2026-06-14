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
import { AlertCircle, Loader2, User, Briefcase, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type LoginRole = 'user' | 'manager' | 'admin';
type LoginStep = 'choose' | 'form';

const CUSTOMER_ROLES = ['customer'];
const MANAGER_ROLES = ['manager'];
const ADMIN_ROLES = ['admin', 'super_admin'];

const cookieOptions = { expires: 7, path: '/' as const };

function saveSession(token: string) {
  Cookies.set('auth_token', token, cookieOptions);
  return decodeToken(token);
}

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('choose');
  const [selectedRole, setSelectedRole] = useState<LoginRole | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const selectRole = (role: LoginRole) => {
    setSelectedRole(role);
    setStep('form');
    setError('');
    reset();
  };

  const goBack = () => {
    setStep('choose');
    setSelectedRole(null);
    setError('');
    reset();
  };

  const onSubmit = async (data: LoginFormData) => {
    if (!selectedRole) return;
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post<{ token: string; user: { role: string } }>(
        '/auth/login',
        { email: data.email, password: data.password },
      );

      const role = response.user.role;
      const token = response.token;

      if (selectedRole === 'user') {
        if (!CUSTOMER_ROLES.includes(role)) {
          setError(
            'This account is not a customer. Use Login as Manager for staff accounts.',
          );
          return;
        }
        saveSession(token);
        router.push('/user/dashboard');
        return;
      }

      if (selectedRole === 'manager') {
        if (!MANAGER_ROLES.includes(role)) {
          setError(
            'This account is not a manager. Contact your administrator for access.',
          );
          return;
        }
        saveSession(token);
        router.push('/manager');
        return;
      }

      if (selectedRole === 'admin') {
        if (!ADMIN_ROLES.includes(role)) {
          setError(
            'This account does not have admin access. Use admin@example.com or contact support.',
          );
          return;
        }
        const session = saveSession(token);
        if (!session || !ADMIN_ROLES.includes(session.role)) {
          setError('Could not start admin session. Please try again.');
          return;
        }
        window.location.href = '/admin';
        return;
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(
        axiosErr.response?.data?.message || 'Login failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formTitle =
    selectedRole === 'user'
      ? 'Customer Login'
      : selectedRole === 'manager'
        ? 'Manager Login'
        : 'Admin Login';

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
          {step === 'choose' ? (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-2">Sign In</h1>
              <p className="text-muted-foreground mb-8">
                Choose how you want to sign in
              </p>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => selectRole('user')}
                  className="w-full text-left"
                >
                  <Card className="p-5 hover:border-primary hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-primary">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground">Login as User</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Shop toys, manage cart and orders
                        </p>
                      </div>
                    </div>
                  </Card>
                </button>

                <button
                  type="button"
                  onClick={() => selectRole('manager')}
                  className="w-full text-left"
                >
                  <Card className="p-5 hover:border-primary hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-primary">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground">Login as Manager</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Manage orders, inventory and customers
                        </p>
                      </div>
                    </div>
                  </Card>
                </button>

              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-primary font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <h1 className="text-2xl font-bold text-foreground mb-2">{formTitle}</h1>
              <p className="text-muted-foreground mb-8">
                Enter your credentials to continue
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
                    placeholder={
                      selectedRole === 'admin'
                        ? 'admin@example.com'
                        : 'you@example.com'
                    }
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
            </>
          )}
        </div>

        {step === 'form' && (
          <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <p className="text-sm font-medium text-foreground mb-2">Demo</p>
            <p className="text-sm text-muted-foreground">
              {selectedRole === 'user' && (
                <>
                  <code className="bg-white px-2 py-0.5 rounded">demo@example.com</code>
                  {' / '}
                  <code className="bg-white px-2 py-0.5 rounded">password123</code>
                </>
              )}
              {selectedRole === 'manager' && (
                <>
                  <code className="bg-white px-2 py-0.5 rounded">manager@example.com</code>
                  {' / '}
                  <code className="bg-white px-2 py-0.5 rounded">password123</code>
                </>
              )}
              {selectedRole === 'admin' && (
                <>
                  <code className="bg-white px-2 py-0.5 rounded">admin@example.com</code>
                  {' / '}
                  <code className="bg-white px-2 py-0.5 rounded">password123</code>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
