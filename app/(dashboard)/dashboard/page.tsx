import { UserButton, currentUser } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | BizOS',
  description: 'BizOS dashboard',
};

export default async function DashboardPage() {
  const user = await currentUser();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-primary">BizOS Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.firstName} {user?.lastName}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Welcome Card */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
            <h2 className="text-xl font-semibold mb-2">Welcome to BizOS!</h2>
            <p className="text-gray-600">
              This is your dashboard where you can manage your AI agents and workflows.
              Get started by creating your first agent or exploring the marketplace.
            </p>
          </div>
          
          {/* Quick Actions Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                Create New Agent
              </button>
              <button className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 transition">
                Browse Marketplace
              </button>
              <button className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 transition">
                Manage Credentials
              </button>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Your Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-gray-600">Active Agents</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-gray-600">Total Executions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-gray-600">Workflows</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-gray-600">Pending Approvals</p>
              </div>
            </div>
          </div>
          
          {/* Recent Activity Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 italic text-center py-4">
                No recent activity to display.
              </p>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
} 