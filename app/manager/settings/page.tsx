'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Lock, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-2">Profile Settings</h2>
              <p className="text-muted-foreground text-sm mb-4">Update your personal information</p>
              <Button variant="outline" size="sm">Edit Profile</Button>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-2">Notifications</h2>
              <p className="text-muted-foreground text-sm mb-4">Configure your notification preferences</p>
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
              <p className="text-muted-foreground text-sm mb-4">Change your password and manage security settings</p>
              <Button variant="outline" size="sm">Update Password</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
