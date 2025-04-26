import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | BizOS',
  description: 'View your business dashboard with key metrics',
};

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your business metrics and performance</p>
        </div>
      </header>
      
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Business Metrics</h2>
        <p className="text-muted-foreground mb-6">This page is under development. Dashboard metrics will be available soon.</p>
      </div>
    </div>
  );
} 