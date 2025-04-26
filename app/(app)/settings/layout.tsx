import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | BizOS',
  description: 'Manage your account and application settings',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 