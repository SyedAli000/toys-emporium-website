'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function RolesPage() {
  const roles = [
    {
      name: 'Super Admin',
      description: 'Full system access and control',
      users: 0,
      permissions: ['All'],
    },
    {
      name: 'Admin',
      description: 'Manage users, products, and orders',
      users: 0,
      permissions: ['Users', 'Products', 'Orders'],
    },
    {
      name: 'Manager',
      description: 'Manage orders and inventory',
      users: 0,
      permissions: ['Orders', 'Inventory'],
    },
    {
      name: 'Customer',
      description: 'Browse and purchase products',
      users: 0,
      permissions: ['Shop', 'Orders'],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Roles & Permissions</h1>
        <p className="text-muted-foreground mt-2">Manage user roles and their permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <Card key={role.name} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">{role.name}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Users with this role: {role.users}</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Permissions:</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm) => (
                  <span key={perm} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              Edit Permissions
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
