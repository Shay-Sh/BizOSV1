'use client';

import { useState } from 'react';
import { 
  RefreshCw, Users, CheckCircle, Bell, Cpu, DollarSign, ArrowUpRight 
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
  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">App Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome to your BizOS dashboard</p>
      </header>
      
      <DashboardGrid>
        {/* Revenue Overview */}
        <GlassPanel className="col-span-1 md:col-span-2 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Revenue Overview</h2>
            <Button variant="ghost" size="sm" className="text-blue-300 hover:text-blue-100 hover:bg-white/10">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Card className="bg-indigo-800/50 border-0">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-500/20 rounded-full mr-3">
                    <DollarSign className="text-green-400" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-300">Total Revenue</p>
                    <p className="text-xl font-bold text-white">$24,589</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-indigo-800/50 border-0">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500/20 rounded-full mr-3">
                    <ArrowUpRight className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-300">Monthly Growth</p>
                    <div className="flex items-center">
                      <p className="text-xl font-bold text-white">12.5%</p>
                      <ArrowUpRight className="ml-1 text-green-400 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="h-60 bg-indigo-800/30 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">[Revenue Chart Placeholder]</p>
          </div>
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
              { task: 'Update user interface', status: 'completed', date: 'Today' },
              { task: 'Fix payment gateway', status: 'in-progress', date: 'Yesterday' },
              { task: 'Prepare quarterly report', status: 'pending', date: '3 days ago' },
              { task: 'Review new feature requests', status: 'pending', date: '4 days ago' },
            ].map((item, index) => (
              <div key={index} className="flex justify-between p-2 rounded bg-indigo-800/30">
                <div>
                  <p className="text-white font-medium">{item.task}</p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>
                <StatusBadge status={item.status as 'completed' | 'in-progress' | 'pending'} />
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
              { message: 'Database backup failed', time: '2 days ago', urgent: true },
              { message: 'API rate limit reached', time: '3 days ago' },
            ].map((item, index) => (
              <div key={index} className={`p-2 rounded ${item.urgent ? 'bg-red-900/30' : 'bg-indigo-800/30'}`}>
                <p className="text-white font-medium">{item.message}</p>
                <p className="text-xs text-gray-400">{item.time}</p>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" className="w-full mt-4 text-blue-300 hover:text-blue-100 hover:bg-white/10">
            View All Notifications
          </Button>
        </GlassPanel>

        {/* System Performance */}
        <GlassPanel className="col-span-1 md:col-span-2 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">System Performance</h2>
            <div className="p-2 bg-cyan-500/20 rounded-full">
              <Cpu className="text-cyan-400" size={20} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="bg-indigo-800/30 border-0">
              <CardContent className="p-4">
                <h3 className="text-gray-300 text-sm mb-1">CPU Usage</h3>
                <p className="text-2xl font-bold text-white">42%</p>
                <Progress value={42} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card className="bg-indigo-800/30 border-0">
              <CardContent className="p-4">
                <h3 className="text-gray-300 text-sm mb-1">Memory Usage</h3>
                <p className="text-2xl font-bold text-white">68%</p>
                <Progress value={68} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card className="bg-indigo-800/30 border-0">
              <CardContent className="p-4">
                <h3 className="text-gray-300 text-sm mb-1">Disk Space</h3>
                <p className="text-2xl font-bold text-white">23%</p>
                <Progress value={23} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>
          
          <div className="h-40 bg-indigo-800/30 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">[System Performance Chart Placeholder]</p>
          </div>
        </GlassPanel>
      </DashboardGrid>
    </div>
  );
} 