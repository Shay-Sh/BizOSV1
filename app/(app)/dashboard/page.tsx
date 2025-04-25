import React from 'react';
import Dashboard from '../../Dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | BizOS',
  description: 'Manage your business efficiently with BizOS dashboard',
};

export default function DashboardPage() {
  return <Dashboard />;
} 