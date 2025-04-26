'use client';

import React, { useState } from 'react';
import { 
  RefreshCw, Users, CheckCircle, Bell, Cpu, DollarSign, ArrowUpRight, 
  BarChart2, Sparkles, MessageSquare, Bot, TrendingUp, CreditCard
} from 'lucide-react';
import { GlassPanel } from '@/components/GlassPanel';
import { DashboardGrid } from '@/components/DashboardGrid';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreditBalance } from '@/components/ui/credit-balance';
import { CreditSummaryCard } from '@/components/ui/credit-summary-card';
import { CreditUsageChart } from '@/components/ui/credit-usage-chart';
import { CreditPurchaseCard } from '@/components/ui/credit-purchase-card';

const StatusBadge = ({ status }: { status: 'completed' | 'in-progress' | 'pending' }) => {
  const colors = {
    'completed': 'bg-green-500/20 text-green-400',
    'in-progress': 'bg-blue-500/20 text-blue-400',
    'pending': 'bg-amber-500/20 text-amber-400'
  };
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colors[status]}`}>
      {status === 'completed' ? 'Completed' : 
       status === 'in-progress' ? 'In Progress' : 'Pending'}
    </span>
  );
};

export default function AppClient() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [credits, setCredits] = useState(750);
  
  // Sample credit packages
  const creditPackages = [
    {
      id: 'basic',
      name: 'Basic',
      credits: 1000,
      price: 25,
      perThousand: 25,
      features: [
        '1,000 credits',
        'Basic support',
        'Credits never expire'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      credits: 5000,
      price: 100,
      perThousand: 20,
      popular: true,
      features: [
        '5,000 credits',
        'Priority support',
        'Credits never expire',
        'Usage analytics'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      credits: 15000,
      price: 250,
      perThousand: 16.67,
      features: [
        '15,000 credits',
        'Dedicated support',
        'Credits never expire',
        'Advanced analytics',
        'Custom integrations'
      ]
    }
  ];
  
  // Sample credit usage history
  const usageHistory = [
    {
      id: '1',
      date: 'Today, 10:30 AM',
      action: 'Agent Execution',
      amount: 25,
      balance: 750
    },
    {
      id: '2',
      date: 'Yesterday, 3:15 PM',
      action: 'Knowledge Base Query',
      amount: 10,
      balance: 775
    },
    {
      id: '3',
      date: '2 days ago',
      action: 'Chat Conversation',
      amount: 15,
      balance: 785
    }
  ];
  
  // Sample usage data for chart
  const usageChartData = [
    { date: 'Jan 1', usage: 120 },
    { date: 'Jan 5', usage: 90 },
    { date: 'Jan 10', usage: 170 },
    { date: 'Jan 15', usage: 60 },
    { date: 'Jan 20', usage: 110 },
    { date: 'Jan 25', usage: 80 },
    { date: 'Jan 30', usage: 150 }
  ];
  
  const handlePurchaseClick = () => {
    setShowPurchaseModal(true);
  };
  
  const handlePurchase = (pkg: any) => {
    setCredits(prev => prev + pkg.credits);
    setShowPurchaseModal(false);
    // In a real app, you would handle payment processing here
  };
  
  if (showPurchaseModal) {
    return (
      <div className="p-6">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => setShowPurchaseModal(false)}
        >
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-white mb-6">Purchase Credits</h1>
        <CreditPurchaseCard 
          packages={creditPackages}
          onPurchase={handlePurchase}
          onCancel={() => setShowPurchaseModal(false)}
        />
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">App Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome to your BizOS dashboard</p>
        </div>
        <CreditBalance 
          balance={credits} 
          size="lg" 
          showAdd={true} 
          onAddClick={handlePurchaseClick}
        />
      </header>
      
      <DashboardGrid>
        {/* Credit Summary Card */}
        <GlassPanel className="col-span-1 md:col-span-2 p-4">
          <CreditSummaryCard 
            credits={credits}
            usageHistory={usageHistory}
            onPurchaseClick={handlePurchaseClick}
          />
        </GlassPanel>

        {/* Active Users */}
        <GlassPanel className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Active Users</h2>
            <div className="p-2 bg-blue-500/20 rounded-full">
              <Users className="text-blue-400" size={20} />
            </div>
          </div>
          
          <p className="text-3xl font-bold text-white mb-1">1,248</p>
          <p className="text-green-400 text-sm mb-4 flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            8% from last week
          </p>
          
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-300">Daily active</span>
                <span className="text-sm text-gray-300">824</span>
              </div>
              <Progress value={65} className="bg-indigo-800/50 h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-300">Weekly active</span>
                <span className="text-sm text-gray-300">1,248</span>
              </div>
              <Progress value={75} className="bg-indigo-800/50 h-2" />
            </div>
          </div>
          
          <div className="flex -space-x-2 overflow-hidden mt-4">
            <Avatar className="border-2 border-indigo-900 w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-indigo-900 w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-indigo-900 w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>TK</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-indigo-900 w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-indigo-900 w-8 h-8 flex items-center justify-center bg-indigo-800 text-blue-300">
              <span className="text-xs font-medium">+42</span>
            </Avatar>
          </div>
        </GlassPanel>

        {/* Credit Usage Chart */}
        <GlassPanel className="col-span-1 md:col-span-2 p-4">
          <div className="mb-2">
            <CreditUsageChart 
              data={usageChartData}
              title="Credit Usage"
              description="Your credit consumption over the last 30 days"
              className="bg-transparent border-0"
            />
          </div>
        </GlassPanel>

        {/* Credit Usage By Type */}
        <GlassPanel className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Credit Usage By Type</h2>
            <div className="p-2 bg-purple-500/20 rounded-full">
              <BarChart2 className="text-purple-400" size={20} />
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { feature: 'Agent Executions', amount: 125, percentage: 50, icon: <Bot className="text-blue-400" size={16} /> },
              { feature: 'Chat Conversations', amount: 75, percentage: 30, icon: <MessageSquare className="text-indigo-400" size={16} /> },
              { feature: 'Knowledge Base', amount: 50, percentage: 20, icon: <Sparkles className="text-amber-400" size={16} /> },
            ].map((item, index) => (
              <div key={index} className="p-2 rounded bg-indigo-800/30">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="p-1 bg-indigo-800/50 rounded-full mr-2">
                      {item.icon}
                    </div>
                    <p className="text-white font-medium">{item.feature}</p>
                  </div>
                  <p className="text-gray-300 text-sm">{item.amount} credits</p>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-blue-300 hover:text-blue-100 hover:bg-white/10"
            onClick={() => alert('View detailed usage analytics')}
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            View Detailed Analytics
          </Button>
        </GlassPanel>

        {/* Recent Tasks */}
        <GlassPanel className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Tasks</h2>
            <div className="p-2 bg-purple-500/20 rounded-full">
              <CheckCircle className="text-purple-400" size={20} />
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { task: 'Update user interface', status: 'completed', date: 'Today', credits: 15 },
              { task: 'Fix payment gateway', status: 'in-progress', date: 'Yesterday', credits: 25 },
              { task: 'Prepare quarterly report', status: 'pending', date: '3 days ago', credits: 20 },
            ].map((item, index) => (
              <div key={index} className="flex justify-between p-2 rounded bg-indigo-800/30">
                <div>
                  <p className="text-white font-medium">{item.task}</p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>
                <div className="flex flex-col items-end">
                  <StatusBadge status={item.status as 'completed' | 'in-progress' | 'pending'} />
                  <span className="text-xs text-gray-400 mt-1">{item.credits} credits</span>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" className="w-full mt-4 text-blue-300 hover:text-blue-100 hover:bg-white/10">
            View All Tasks
          </Button>
        </GlassPanel>

        {/* Notifications */}
        <GlassPanel className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <div className="p-2 bg-red-500/20 rounded-full">
              <Bell className="text-red-400" size={20} />
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { message: 'New user registered', time: '2 hours ago' },
              { message: 'Server update completed', time: 'Yesterday' },
              { message: 'Low credit balance warning', time: '2 days ago', urgent: true, credits: true },
              { message: 'API rate limit reached', time: '3 days ago' },
            ].map((item, index) => (
              <div key={index} className={`p-2 rounded ${item.urgent ? 'bg-red-900/30' : 'bg-indigo-800/30'}`}>
                <p className="text-white font-medium">{item.message}</p>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-400">{item.time}</p>
                  {item.credits && (
                    <span className="text-xs text-red-400">Action required</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" className="w-full mt-4 text-blue-300 hover:text-blue-100 hover:bg-white/10">
            View All Notifications
          </Button>
        </GlassPanel>

        {/* Quick Access Agents */}
        <GlassPanel className="col-span-1 md:col-span-2 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Your Agents</h2>
            <Button variant="outline" size="sm" onClick={() => alert('View all agents')}>
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { 
                name: 'Customer Support', 
                description: 'Handles customer inquiries automatically',
                executions: 156,
                costPerRun: 5,
                icon: <MessageSquare className="text-blue-400" size={20} />
              },
              { 
                name: 'Data Analyzer', 
                description: 'Processes and visualizes business data',
                executions: 42,
                costPerRun: 15,
                icon: <BarChart2 className="text-purple-400" size={20} />
              },
              { 
                name: 'Content Creator', 
                description: 'Generates blog posts and social content',
                executions: 78,
                costPerRun: 10,
                icon: <Sparkles className="text-amber-400" size={20} />
              }
            ].map((agent, index) => (
              <Card key={index} className="bg-indigo-800/30 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-indigo-900/80 rounded-full">
                      {agent.icon}
                    </div>
                    <div className="bg-indigo-900/50 rounded-full px-2 py-1 text-xs text-gray-300 flex items-center">
                      <CreditCard className="h-3 w-3 mr-1" />
                      {agent.costPerRun} credits/run
                    </div>
                  </div>
                  <h3 className="text-white font-semibold mb-1">{agent.name}</h3>
                  <p className="text-gray-300 text-sm mb-3">{agent.description}</p>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{agent.executions} executions</span>
                    <span>
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      Active
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </GlassPanel>
      </DashboardGrid>
    </div>
  );
} 