import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Settings | BizOS',
  description: 'Manage your profile settings and personal information',
};

export default function ProfileSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Update your personal information and preferences</p>
        </div>
      </header>
      
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <p className="text-muted-foreground mb-6">This page is under development. Profile settings will be available soon.</p>
        
        <div className="flex items-center gap-4">
          <a href="/app/settings" className="text-primary hover:underline">&larr; Back to Settings</a>
        </div>
      </div>
    </div>
  );
} 