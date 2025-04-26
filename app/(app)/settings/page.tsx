'use client';

import { Metadata } from 'next';
import { useAuth } from '@/lib/supabase/auth-context';

export const metadata: Metadata = {
  title: 'Settings | BizOS',
  description: 'Manage your account and application settings',
};

export default function SettingsPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    // Redirect will be handled by auth context
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md font-medium hover:bg-destructive/90"
        >
          Sign Out
        </button>
      </header>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <ul className="space-y-4">
            <li>
              <a href="/app/settings/profile" className="text-primary hover:underline">Profile Information</a>
              <p className="text-sm text-muted-foreground">Update your personal information and avatar</p>
            </li>
            <li>
              <a href="/app/settings/password" className="text-primary hover:underline">Password & Security</a>
              <p className="text-sm text-muted-foreground">Manage your password and security settings</p>
            </li>
            <li>
              <a href="/app/settings/notifications" className="text-primary hover:underline">Notification Preferences</a>
              <p className="text-sm text-muted-foreground">Control which notifications you receive</p>
            </li>
          </ul>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Billing & Credits</h2>
          <ul className="space-y-4">
            <li>
              <a href="/app/settings/credits" className="text-primary hover:underline">Credits Management</a>
              <p className="text-sm text-muted-foreground">View and purchase credits for your account</p>
            </li>
            <li>
              <a href="/app/settings/billing" className="text-primary hover:underline">Billing Information</a>
              <p className="text-sm text-muted-foreground">Update your billing details and view history</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 