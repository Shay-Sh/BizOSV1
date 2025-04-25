'use client';

import React, { useState } from 'react';
import { 
  FiRefreshCw, FiUsers, FiCheckCircle, FiBell, FiCpu, FiDollarSign, FiCalendar 
} from 'react-icons/fi';
import { GlassPanel } from '../components/GlassPanel';
import { DashboardGrid } from '../components/DashboardGrid';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8">App Dashboard</h1>
      
      <DashboardGrid>
        {/* Revenue Overview */}
        <GlassPanel className="col-span-1 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Revenue Overview</h2>
            <button className="flex items-center text-blue-300 hover:text-blue-100 transition-colors">
              <FiRefreshCw className="mr-1" /> Refresh
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="bg-indigo-800/50 rounded-lg p-4 flex-1">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-full mr-3">
                  <FiDollarSign className="text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-300">Total Revenue</p>
                  <p className="text-xl font-bold text-white">$24,589</p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-800/50 rounded-lg p-4 flex-1">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/20 rounded-full mr-3">
                  <FiCalendar className="text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-300">Monthly Growth</p>
                  <p className="text-xl font-bold text-white">+12.5%</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-60 mt-4 bg-indigo-800/30 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">[Revenue Chart Placeholder]</p>
          </div>
        </GlassPanel>

        {/* Active Users */}
        <GlassPanel>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Active Users</h2>
            <div className="p-2 bg-blue-500/20 rounded-full">
              <FiUsers className="text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">1,248</p>
          <p className="text-green-400 text-sm mb-4">↑ 8% from last week</p>
          <div className="h-40 bg-indigo-800/30 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">[User Activity Chart]</p>
          </div>
        </GlassPanel>

        {/* Recent Tasks */}
        <GlassPanel>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Tasks</h2>
            <div className="p-2 bg-purple-500/20 rounded-full">
              <FiCheckCircle className="text-purple-400" />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { task: 'Update user interface', status: 'Completed', date: 'Today' },
              { task: 'Fix payment gateway', status: 'In Progress', date: 'Yesterday' },
              { task: 'Prepare quarterly report', status: 'Pending', date: '3 days ago' },
            ].map((item, index) => (
              <div key={index} className="flex justify-between p-2 rounded bg-indigo-800/30">
                <div>
                  <p className="text-white font-medium">{item.task}</p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>
                <span 
                  className={`text-xs px-2 py-1 rounded-full self-start ${
                    item.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 
                    item.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 
                    'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Notifications */}
        <GlassPanel>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <div className="p-2 bg-red-500/20 rounded-full">
              <FiBell className="text-red-400" />
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
        </GlassPanel>

        {/* System Performance */}
        <GlassPanel>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">System Performance</h2>
            <div className="p-2 bg-cyan-500/20 rounded-full">
              <FiCpu className="text-cyan-400" />
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'CPU Usage', value: 42, color: 'bg-cyan-400' },
              { label: 'Memory Usage', value: 68, color: 'bg-purple-400' },
              { label: 'Disk Space', value: 23, color: 'bg-green-400' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300 text-sm">{item.label}</span>
                  <span className="text-white text-sm">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full`} 
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </DashboardGrid>
    </div>
  );
};

export default Dashboard; 