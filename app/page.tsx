import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LandingPage from './components/LandingPage';

export const metadata: Metadata = {
  title: 'BizOS - Business AI Operating System',
  description: 'Modern platform for AI agents and business workflows',
};

export default function Home() {
  // For static rendering on root page
  return <LandingPage />;
}