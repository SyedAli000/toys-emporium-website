'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Bell, Lock, Globe, Mail } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Configure your platform settings</p>
      </div>

      <div className="space-y-6">
        {/* Store Settings */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-2">Store Settings</h2>
              <p className="text-muted-foreground text-sm mb-4">Configure your store name, logo, and contact information</p>
              <Button variant="outline" size="sm">Edit Store Settings</Button>
            </div>
          </div>
        </Card>

        {/* Email Settings */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-2">Email Configuration</h2>
              <p className="text-muted-foreground text-sm mb-4">Configure SMTP settings and email templates</p>
              <Button variant="outline" size="sm">Configure Email</Button>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-2">Notifications</h2>
              <p className="text-muted-foreground text-sm mb-4">Configure system notifications and alerts</p>
              <Button variant="outline" size="sm">Manage Notifications</Button>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-2">Security</h2>
              <p className="text-muted-foreground text-sm mb-4">Manage security policies and backup settings</p>
              <Button variant="outline" size="sm">Security Settings</Button>
            </div>
          </div>
        </Card>

        {/* System Settings */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-2">System Configuration</h2>
              <p className="text-muted-foreground text-sm mb-4">Configure system-wide settings and maintenance</p>
              <Button variant="outline" size="sm">System Settings</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
