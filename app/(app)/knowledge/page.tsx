'use client';

import { useState } from 'react';
import { GlassPanel } from '@/components/ui/glass-panel';
import { DashboardGrid } from '@/components/dashboard/dashboard-grid';
import { Button } from '@/components/ui/button';
import { Search, Plus, Folder, FileText, Upload } from 'lucide-react';

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for knowledge bases
  const knowledgeBases = [
    {
      id: '1',
      name: 'Company Policies',
      description: 'HR policies and company guidelines',
      documentsCount: 12,
      updatedAt: '2023-05-10T14:30:00Z',
    },
    {
      id: '2',
      name: 'Product Documentation',
      description: 'User guides and technical specifications',
      documentsCount: 24,
      updatedAt: '2023-05-12T09:45:00Z',
    },
    {
      id: '3',
      name: 'Marketing Materials',
      description: 'Brand guidelines and marketing templates',
      documentsCount: 8,
      updatedAt: '2023-05-14T11:20:00Z',
    },
  ];

  const recentDocuments = [
    {
      id: '1',
      title: 'Employee Handbook',
      type: 'PDF',
      knowledgeBaseId: '1',
      knowledgeBaseName: 'Company Policies',
      updatedAt: '2023-05-14T16:30:00Z',
    },
    {
      id: '2',
      title: 'Product Feature Specifications',
      type: 'DOCX',
      knowledgeBaseId: '2',
      knowledgeBaseName: 'Product Documentation',
      updatedAt: '2023-05-13T10:15:00Z',
    },
    {
      id: '3',
      title: 'Brand Style Guide',
      type: 'PDF',
      knowledgeBaseId: '3',
      knowledgeBaseName: 'Marketing Materials',
      updatedAt: '2023-05-12T14:45:00Z',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground">Manage and organize documents for your AI agents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload size={16} />
            Upload Document
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            New Knowledge Base
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'all' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('all')}
          >
            All
          </Button>
          <Button 
            variant={activeTab === 'recent' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('recent')}
          >
            Recent
          </Button>
          <Button 
            variant={activeTab === 'shared' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('shared')}
          >
            Shared with me
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search knowledge bases..." 
            className="pl-10 pr-4 py-2 rounded-md bg-background/50 border border-border"
          />
        </div>
      </div>
      
      <DashboardGrid>
        <GlassPanel className="col-span-8">
          <h2 className="text-xl font-semibold mb-4">Knowledge Bases</h2>
          
          <div className="space-y-4">
            {knowledgeBases.map((kb) => (
              <div 
                key={kb.id} 
                className="p-4 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-primary/10 mr-4">
                    <Folder className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{kb.name}</h3>
                    <p className="text-muted-foreground text-sm">{kb.description}</p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <span>{kb.documentsCount} documents</span>
                      <span className="mx-2">•</span>
                      <span>Updated {new Date(kb.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Open</Button>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="col-span-4">
          <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
          
          <div className="space-y-4">
            {recentDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className="p-3 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-primary/10 mr-3">
                    <FileText className="text-primary" size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{doc.title}</h3>
                    <p className="text-muted-foreground text-xs">{doc.knowledgeBaseName}</p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <span className="uppercase">{doc.type}</span>
                      <span className="mx-2">•</span>
                      <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </DashboardGrid>
    </div>
  );
} 