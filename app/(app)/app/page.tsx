import { Metadata } from 'next';
import AppClient from './app-client';

export const metadata: Metadata = {
  title: 'App Dashboard | BizOS',
  description: 'Modern application dashboard with glass morphism components',
};

export default function AppPage() {
  return <AppClient />;
} 