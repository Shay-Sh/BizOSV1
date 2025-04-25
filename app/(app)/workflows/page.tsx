import { Metadata } from 'next';
import WorkflowsClient from './workflows-client';

export const metadata: Metadata = {
  title: 'Workflows | BizOS',
  description: 'Create and manage AI-powered workflows',
};

export default function WorkflowsPage() {
  return <WorkflowsClient />;
} 