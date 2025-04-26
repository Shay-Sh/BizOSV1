'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/ui/glass-panel';
import { cn } from '@/utils/classnames';
import {
  Plus,
  PlusCircle,
  Search,
  Filter,
  Folder,
  File,
  Share2,
  Star,
  MoreHorizontal,
  Grid,
  List,
  FileText,
  Trash2,
  Clock
} from 'lucide-react';

// Mock data for workspaces
const recentFiles = [
  { id: '1', name: 'Q1 Marketing Plan', type: 'document', updatedAt: '2023-09-10T14:30:00Z', owner: 'You', starred: true },
  { id: '2', name: 'Product Roadmap', type: 'spreadsheet', updatedAt: '2023-09-08T09:45:00Z', owner: 'Alex Chen', starred: false },
  { id: '3', name: 'Customer Feedback Analysis', type: 'document', updatedAt: '2023-09-07T16:20:00Z', owner: 'You', starred: true },
  { id: '4', name: 'UI Design Assets', type: 'folder', updatedAt: '2023-09-05T11:15:00Z', owner: 'Sarah Kim', starred: false },
  { id: '5', name: 'Sales Presentation', type: 'presentation', updatedAt: '2023-09-01T15:30:00Z', owner: 'You', starred: false },
];

const workspaces = [
  { id: '1', name: 'Marketing Projects', fileCount: 24, members: 5 },
  { id: '2', name: 'Product Development', fileCount: 47, members: 8 },
  { id: '3', name: 'Customer Success', fileCount: 18, members: 4 },
  { id: '4', name: 'Executive Planning', fileCount: 12, members: 3 },
];

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// File type icon component
function FileTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'folder':
      return <Folder className="h-5 w-5 text-blue-400" />;
    case 'document':
      return <FileText className="h-5 w-5 text-purple-400" />;
    case 'spreadsheet':
      return <FileText className="h-5 w-5 text-green-400" />;
    case 'presentation':
      return <FileText className="h-5 w-5 text-orange-400" />;
    default:
      return <File className="h-5 w-5 text-gray-400" />;
  }
}

// Workspace stats component
function WorkspaceStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <GlassPanel className="p-4">
        <div className="flex flex-col">
          <span className="text-slate-400 text-sm">Total Workspaces</span>
          <span className="text-white text-2xl font-bold">12</span>
        </div>
      </GlassPanel>
      
      <GlassPanel className="p-4">
        <div className="flex flex-col">
          <span className="text-slate-400 text-sm">Total Files</span>
          <span className="text-white text-2xl font-bold">142</span>
        </div>
      </GlassPanel>
      
      <GlassPanel className="p-4">
        <div className="flex flex-col">
          <span className="text-slate-400 text-sm">Storage Used</span>
          <span className="text-white text-2xl font-bold">1.7 GB</span>
        </div>
      </GlassPanel>
      
      <GlassPanel className="p-4">
        <div className="flex flex-col">
          <span className="text-slate-400 text-sm">Shared With Me</span>
          <span className="text-white text-2xl font-bold">37</span>
        </div>
      </GlassPanel>
    </div>
  );
}

export default function WorkspaceClient() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Workspace</h1>
          <p className="text-slate-400 mt-1">Organize and manage your documents and collaborative workspaces</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Workspace
        </Button>
      </header>
      
      <WorkspaceStats />
      
      <GlassPanel className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search files and workspaces..."
              className="w-full pl-10 pr-4 py-2 bg-indigo-800/30 border border-indigo-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-indigo-700 text-white">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <div className="flex bg-indigo-800/30 border border-indigo-700 rounded-md">
              <button 
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600' : ''} rounded-l-md`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} className="text-white" />
              </button>
              <button 
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600' : ''} rounded-r-md`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </GlassPanel>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassPanel className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">My Workspaces</h2>
              <Button variant="outline" className="border-indigo-700 text-white text-sm p-2 h-auto">
                <Plus size={16} className="mr-1" />
                New
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workspaces.map(workspace => (
                <div key={workspace.id} className="bg-indigo-800/20 border border-indigo-700/50 rounded-lg p-4 hover:bg-indigo-800/30 transition-colors cursor-pointer">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Folder className="h-8 w-8 text-blue-400 mr-3" />
                      <div>
                        <h3 className="font-medium text-white">{workspace.name}</h3>
                        <p className="text-sm text-slate-400">{workspace.fileCount} files</p>
                      </div>
                    </div>
                    <div className="text-slate-400">
                      <MoreHorizontal size={20} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, workspace.members))].map((_, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-indigo-800 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">{String.fromCharCode(65 + i)}</span>
                        </div>
                      ))}
                      {workspace.members > 3 && (
                        <div className="w-7 h-7 rounded-full bg-indigo-700 border-2 border-indigo-800 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">+{workspace.members - 3}</span>
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                      <Share2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
          
          <GlassPanel className="p-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Recent Files</h2>
              <div className="flex items-center text-sm text-slate-400">
                <Clock size={16} className="mr-1" />
                <span>Last 30 days</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-indigo-700/50 text-left">
                    <th className="pb-2 text-slate-400 font-medium text-sm">Name</th>
                    <th className="pb-2 text-slate-400 font-medium text-sm">Last Modified</th>
                    <th className="pb-2 text-slate-400 font-medium text-sm">Owner</th>
                    <th className="pb-2 text-slate-400 font-medium text-sm w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentFiles.map(file => (
                    <tr key={file.id} className="border-b border-indigo-700/30 hover:bg-indigo-800/20">
                      <td className="py-3">
                        <div className="flex items-center">
                          <FileTypeIcon type={file.type} />
                          <span className="ml-2 text-white">{file.name}</span>
                          {file.starred && <Star className="h-4 w-4 text-yellow-400 ml-2 fill-yellow-400" />}
                        </div>
                      </td>
                      <td className="py-3 text-slate-400">{formatDate(file.updatedAt)}</td>
                      <td className="py-3 text-slate-400">
                        {file.owner === 'You' ? <span className="text-blue-400">You</span> : file.owner}
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                          <MoreHorizontal size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </div>
        
        <div>
          <GlassPanel className="p-4">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Document
              </Button>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 justify-start">
                <Folder className="mr-2 h-4 w-4" />
                New Folder
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
                <Share2 className="mr-2 h-4 w-4" />
                Share Files
              </Button>
              <Button variant="outline" className="w-full border-indigo-700 text-white justify-start">
                <Trash2 className="mr-2 h-4 w-4 text-red-400" />
                Trash
              </Button>
            </div>
          </GlassPanel>
          
          <GlassPanel className="p-4 mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Storage</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Used</span>
                  <span className="text-white">1.7 GB / 10 GB</span>
                </div>
                <div className="w-full bg-indigo-900/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '17%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-sm bg-blue-500 mr-2"></div>
                    <span className="text-slate-400 text-sm">Documents</span>
                  </div>
                  <span className="text-white text-sm">0.8 GB</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-sm bg-purple-500 mr-2"></div>
                    <span className="text-slate-400 text-sm">Media</span>
                  </div>
                  <span className="text-white text-sm">0.6 GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-sm bg-green-500 mr-2"></div>
                    <span className="text-slate-400 text-sm">Other</span>
                  </div>
                  <span className="text-white text-sm">0.3 GB</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full border-indigo-700 text-white text-sm">
                Upgrade Storage
              </Button>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
} 