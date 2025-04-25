import { Metadata } from 'next';
import DashboardClient from './dashboard-client';

export const metadata: Metadata = {
  title: 'Dashboard | BizOS',
  description: 'Manage your business efficiently with BizOS dashboard',
};

export default async function DashboardPage() {
  // The DashboardClient component handles authentication through the AuthContext
  // No need to pass user props as DashboardClient uses useAuth() hook
  return <DashboardClient />;
} 