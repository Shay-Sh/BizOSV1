import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agents | BizOS',
  description: 'Manage your AI agents with BizOS',
};

export default function AgentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Agents</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          The Agents feature is currently under development. Check back soon for updates!
        </p>
        <p className="text-sm text-gray-500">
          You&apos;ll be able to create, manage, and deploy AI agents for your business workflows.
        </p>
      </div>
    </div>
  );
} 