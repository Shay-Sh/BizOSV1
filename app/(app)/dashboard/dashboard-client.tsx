'use client';

import React, { useState } from 'react';
import { MdRefresh, MdMoreVert } from 'react-icons/md';
import DashboardGrid from '@/components/ui/DashboardGrid';
import GlassPanel from '@/components/ui/GlassPanel';
import StatDisplay from '@/components/ui/StatDisplay';
import NotificationItem from '@/components/ui/NotificationItem';
import TaskItem from '@/components/ui/TaskItem';
import { useAuth } from '@/lib/supabase/auth-context';

const DashboardClient = () => {
  const { user } = useAuth();
  
  // Example notifications data
  const notifications = [
    { id: 1, title: 'New message', description: 'You have 3 unread messages', time: '2m ago', read: false },
    { id: 2, title: 'Server update', description: 'Server restart scheduled', time: '1h ago', read: true },
    { id: 3, title: 'Payment received', description: 'Payment of $1,200 received', time: '3h ago', read: false }
  ];
  
  // Tasks state with toggle functionality
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Update user interface', completed: false },
    { id: 2, title: 'Fix login issues', completed: false },
    { id: 3, title: 'Implement analytics', completed: false },
    { id: 4, title: 'Review feedback', completed: true }
  ]);
  
  // Toggle task completion
  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Welcome, {user?.email?.split('@')[0] || 'User'}
      </h1>
      
      <DashboardGrid>
        {/* Revenue Panel */}
        <GlassPanel 
          title="Revenue Overview" 
          headerRight={
            <button className="p-1 rounded-full hover:bg-white/10">
              <MdRefresh className="h-5 w-5 text-white/70" />
            </button>
          }
        >
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <StatDisplay 
                label="Total Revenue" 
                value="$24,500" 
                valueSize="lg"
              />
              <StatDisplay 
                label="Growth" 
                value="12.5%" 
                trend={{ value: "12.5%", positive: true }}
              />
            </div>
            <div className="h-40 bg-white/5 rounded-lg flex items-center justify-center">
              {/* Chart would go here */}
              <p className="text-white/40">Revenue Chart</p>
            </div>
          </div>
        </GlassPanel>

        {/* Users Panel */}
        <GlassPanel 
          title="Active Users" 
          headerRight={
            <div className="flex space-x-2">
              <button className="p-1 rounded-full hover:bg-white/10">
                <MdRefresh className="h-5 w-5 text-white/70" />
              </button>
              <button className="p-1 rounded-full hover:bg-white/10">
                <MdMoreVert className="h-5 w-5 text-white/70" />
              </button>
            </div>
          }
        >
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <StatDisplay 
                label="Current Users" 
                value={1245}
              />
              <StatDisplay 
                label="New Today" 
                value={26} 
                trend={{ value: 26, positive: true }}
              />
            </div>
            <div className="h-40 bg-white/5 rounded-lg flex items-center justify-center">
              {/* User activity graph would go here */}
              <p className="text-white/40">User Activity</p>
            </div>
          </div>
        </GlassPanel>

        {/* Tasks Panel */}
        <GlassPanel title="Recent Tasks">
          <div className="p-4">
            <ul className="space-y-3">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  title={task.title}
                  completed={task.completed}
                  onToggle={() => toggleTask(task.id)}
                />
              ))}
            </ul>
          </div>
        </GlassPanel>

        {/* Notifications Panel */}
        <GlassPanel title="Notifications">
          <div className="p-4">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  title={notification.title}
                  description={notification.description}
                  time={notification.time}
                  read={notification.read}
                  onClick={() => console.log(`Clicked notification: ${notification.id}`)}
                />
              ))}
            </div>
          </div>
        </GlassPanel>

        {/* Performance Panel - Wide panel spanning 2 columns */}
        <GlassPanel 
          title="System Performance" 
          className="md:col-span-2"
        >
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/5 p-3 rounded-lg">
                <StatDisplay label="CPU" value="42%" />
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <StatDisplay label="Memory" value="68%" />
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <StatDisplay label="Storage" value="57%" />
              </div>
            </div>
            <div className="h-32 bg-white/5 rounded-lg flex items-center justify-center">
              {/* Performance chart would go here */}
              <p className="text-white/40">Performance Metrics</p>
            </div>
          </div>
        </GlassPanel>
      </DashboardGrid>
    </div>
  );
};

export default DashboardClient; 