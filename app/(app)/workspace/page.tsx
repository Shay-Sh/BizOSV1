import { Metadata } from 'next';
import WorkspaceClient from './workspace-client';

export const metadata: Metadata = {
  title: 'Workspace | BizOS',
  description: 'Organize and manage your workspace in BizOS',
};

export default function WorkspacePage() {
  return <WorkspaceClient />;
} 