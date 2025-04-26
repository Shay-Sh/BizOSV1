'use client';

import React, { useState } from 'react';
import { 
  FiRefreshCw, FiUsers, FiCheckCircle, FiBell, FiCpu, FiDollarSign, FiCalendar 
} from 'react-icons/fi';
import { GlassPanel } from '../components/ui/glass-panel';
import DashboardGrid from '../components/ui/DashboardGrid';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold text-foreground mb-8">App Dashboard</h1>
      
      <DashboardGrid>
        {/* Revenue Overview */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Revenue Overview</CardTitle>
            <button className="flex items-center text-primary hover:text-primary/80 transition-colors">
              <FiRefreshCw className="mr-1" /> Refresh
            </button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="bg-muted rounded-lg p-4 flex-1">
                <div className="flex items-center">
                  <div className="p-2 bg-green-500/20 rounded-full mr-3">
                    <FiDollarSign className="text-success" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="text-xl font-bold">$24,589</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 flex-1">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500/20 rounded-full mr-3">
                    <FiCalendar className="text-info" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Growth</p>
                    <p className="text-xl font-bold">+12.5%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-60 mt-4 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">[Revenue Chart Placeholder]</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Active Users</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-full">
              <FiUsers className="text-info" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-1">1,248</p>
            <p className="text-success text-sm mb-4">↑ 8% from last week</p>
            <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">[User Activity Chart]</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Recent Tasks</CardTitle>
            <div className="p-2 bg-purple-500/20 rounded-full">
              <FiCheckCircle className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { task: 'Update user interface', status: 'Completed', date: 'Today' },
                { task: 'Fix payment gateway', status: 'In Progress', date: 'Yesterday' },
                { task: 'Prepare quarterly report', status: 'Pending', date: '3 days ago' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between p-2 rounded bg-muted">
                  <div>
                    <p className="font-medium">{item.task}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <span 
                    className={`text-xs px-2 py-1 rounded-full self-start ${
                      item.status === 'Completed' ? 'bg-success/20 text-success' : 
                      item.status === 'In Progress' ? 'bg-info/20 text-info' : 
                      'bg-warning/20 text-warning'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Notifications</CardTitle>
            <div className="p-2 bg-red-500/20 rounded-full">
              <FiBell className="text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { message: 'New user registered', time: '2 hours ago' },
                { message: 'Server update completed', time: 'Yesterday' },
                { message: 'Database backup failed', time: '2 days ago', urgent: true },
                { message: 'API rate limit reached', time: '3 days ago' },
              ].map((item, index) => (
                <div key={index} className={`p-2 rounded ${item.urgent ? 'bg-destructive/10' : 'bg-muted'}`}>
                  <p className="font-medium">{item.message}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">System Performance</CardTitle>
            <div className="p-2 bg-cyan-500/20 rounded-full">
              <FiCpu className="text-info" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'CPU Usage', value: 42, color: 'bg-info' },
                { label: 'Memory Usage', value: 68, color: 'bg-primary' },
                { label: 'Disk Space', value: 23, color: 'bg-success' },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground text-sm">{item.label}</span>
                    <span className="text-foreground text-sm">{item.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full`} 
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DashboardGrid>
    </div>
  );
};

export default Dashboard; 