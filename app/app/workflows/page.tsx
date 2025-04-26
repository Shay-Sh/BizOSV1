import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workflows | BizOS',
  description: 'Manage your business workflows and automations',
};

export default function WorkflowsPage() {
  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Workflows</h1>
          <p className="text-muted-foreground">Create and manage automated workflows for your business</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90">
          New Workflow
        </button>
      </header>
      
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Workflow Dashboard</h2>
        <p className="text-muted-foreground mb-6">This page is under development. Workflow management will be available soon.</p>
      </div>
    </div>
  );
} 