import { Metadata } from 'next';
import AgentsClient from './agents-client';

export const metadata: Metadata = {
  title: 'Agents | BizOS',
  description: 'Manage your AI agents and workflows',
};

export default function AgentsPage() {
  return <AgentsClient />;
} 