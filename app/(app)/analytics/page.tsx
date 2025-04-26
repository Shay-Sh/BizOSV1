import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics | BizOS',
  description: 'View analytics and insights for your business',
};

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Analyze your business performance and agent usage</p>
        </div>
      </header>
      
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
        <p className="text-muted-foreground mb-6">This page is under development. Analytics will be available soon.</p>
      </div>
    </div>
  );
} 