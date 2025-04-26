'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/ui/glass-panel';
import { DashboardGrid } from '@/components/dashboard/dashboard-grid';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { Clock, CheckCircle, XCircle, AlertTriangle, ChevronRight, Filter } from 'lucide-react';

export default function ApprovalsPage() {
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for approval requests
  const approvalRequests = [
    {
      id: '1',
      title: 'Large Transaction Approval',
      description: 'Customer requested a funds transfer exceeding $10,000',
      status: 'pending',
      priority: 'high',
      requestedBy: 'Finance Agent',
      assignedTo: 'Finance Manager',
      createdAt: '2023-05-15T10:30:00Z',
      dueDate: '2023-05-16T10:30:00Z',
    },
    {
      id: '2',
      title: 'New Marketing Campaign',
      description: 'Approval needed for social media campaign budget',
      status: 'pending',
      priority: 'medium',
      requestedBy: 'Marketing Agent',
      assignedTo: 'Marketing Director',
      createdAt: '2023-05-14T14:15:00Z',
      dueDate: '2023-05-17T14:15:00Z',
    },
    {
      id: '3',
      title: 'Customer Refund Request',
      description: 'Customer requested a refund for service interruption',
      status: 'approved',
      priority: 'medium',
      requestedBy: 'Support Agent',
      assignedTo: 'Support Manager',
      createdAt: '2023-05-13T09:45:00Z',
      dueDate: '2023-05-14T09:45:00Z',
      approvedAt: '2023-05-13T11:30:00Z',
      approvedBy: 'Support Manager',
    },
    {
      id: '4',
      title: 'New Vendor Onboarding',
      description: 'Request to add new vendor to the system',
      status: 'rejected',
      priority: 'low',
      requestedBy: 'Procurement Agent',
      assignedTo: 'Procurement Manager',
      createdAt: '2023-05-12T16:20:00Z',
      dueDate: '2023-05-15T16:20:00Z',
      rejectedAt: '2023-05-14T10:15:00Z',
      rejectedBy: 'Procurement Manager',
      rejectionReason: 'Incomplete documentation',
    },
    {
      id: '5',
      title: 'Content Publication',
      description: 'New blog post requires approval before publishing',
      status: 'pending',
      priority: 'high',
      requestedBy: 'Content Agent',
      assignedTo: 'Content Manager',
      createdAt: '2023-05-15T08:45:00Z',
      dueDate: '2023-05-15T14:00:00Z',
    },
  ];

  // Filter options
  const filterCategories = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    {
      name: 'priority',
      label: 'Priority',
      options: [
        { label: 'All', value: 'all' },
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' },
      ],
    },
    {
      name: 'assignedTo',
      label: 'Assigned To',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Me', value: 'me' },
        { label: 'Others', value: 'others' },
        { label: 'Unassigned', value: 'unassigned' },
      ],
    },
  ];

  const handleSearch = (value: string) => {
    console.log('Search value:', value);
  };

  const handleFilterChange = (category: string, value: string) => {
    if (category === 'status') {
      setFilterStatus(value);
    }
    console.log(`Filter changed: ${category} = ${value}`);
  };

  const handleClearFilters = () => {
    setFilterStatus('all');
    console.log('Filters cleared');
  };

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500/80">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/80">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/80">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Function to render priority badge
  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="border-red-500/50 text-red-500">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-amber-500/50 text-amber-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-blue-500/50 text-blue-500">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Filter requests based on current filter
  const filteredRequests = approvalRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Approval Center</h1>
          <p className="text-muted-foreground">Manage human-in-the-loop decisions for your AI agents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            Manage Policies
          </Button>
          <Button>New Approval Request</Button>
        </div>
      </div>

      <FilterBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterCategories={filterCategories}
        placeholder="Search approval requests..."
      />

      {/* Stats Row */}
      <DashboardGrid>
        <GlassPanel className="col-span-3">
          <div className="flex items-center">
            <Clock className="mr-4 text-amber-500" size={36} />
            <div>
              <h3 className="text-lg font-semibold">Pending</h3>
              <p className="text-3xl font-bold">{approvalRequests.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="col-span-3">
          <div className="flex items-center">
            <CheckCircle className="mr-4 text-green-500" size={36} />
            <div>
              <h3 className="text-lg font-semibold">Approved</h3>
              <p className="text-3xl font-bold">{approvalRequests.filter(r => r.status === 'approved').length}</p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="col-span-3">
          <div className="flex items-center">
            <XCircle className="mr-4 text-red-500" size={36} />
            <div>
              <h3 className="text-lg font-semibold">Rejected</h3>
              <p className="text-3xl font-bold">{approvalRequests.filter(r => r.status === 'rejected').length}</p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="col-span-3">
          <div className="flex items-center">
            <AlertTriangle className="mr-4 text-amber-500" size={36} />
            <div>
              <h3 className="text-lg font-semibold">Due Today</h3>
              <p className="text-3xl font-bold">
                {approvalRequests.filter(r => {
                  const dueDate = new Date(r.dueDate);
                  const today = new Date();
                  return dueDate.toDateString() === today.toDateString() && r.status === 'pending';
                }).length}
              </p>
            </div>
          </div>
        </GlassPanel>
      </DashboardGrid>

      {/* Approval Requests */}
      <GlassPanel>
        <h2 className="text-xl font-semibold mb-4">Approval Requests</h2>
        
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No approval requests match your filters</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div 
                key={request.id} 
                className="p-4 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium mr-3">{request.title}</h3>
                      {renderStatusBadge(request.status)}
                      <span className="mx-2"></span>
                      {renderPriorityBadge(request.priority)}
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{request.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>Requested by: {request.requestedBy}</span>
                      <span className="mx-2">•</span>
                      <span>Assigned to: {request.assignedTo}</span>
                      <span className="mx-2">•</span>
                      <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>Due: {new Date(request.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {request.status === 'pending' && (
                      <>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-500/50 hover:bg-red-500/10">
                          Reject
                        </Button>
                        <Button size="sm" className="text-primary-foreground bg-green-500 hover:bg-green-600">
                          Approve
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon">
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassPanel>
    </div>
  );
} 