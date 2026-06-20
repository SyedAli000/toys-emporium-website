import { UserRole } from '@/lib/types';

export const STAFF_ROLES: UserRole[] = ['super_admin', 'admin', 'manager'];

export function isStaffRole(role: UserRole | string): boolean {
  return STAFF_ROLES.includes(role as UserRole);
}

export function getDashboardPath(role: UserRole | string): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/admin';
    case 'manager':
      return '/manager';
    case 'customer':
      return '/user/dashboard';
    default:
      return '/login';
  }
}

export function getRoleLabel(role: UserRole | string): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    case 'manager':
      return 'Manager';
    case 'customer':
      return 'Customer';
    default:
      return 'User';
  }
}
