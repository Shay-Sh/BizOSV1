'use client';

import { useState } from 'react';
import { 
  Search, Plus, MoreHorizontal, Play, FileCode, Share2,
  Trash2, Copy, Clock, PlusCircle, Activity, CheckCircle2, 
  ArrowRight, MessageSquare, Filter, Eye, Calendar
} from 'lucide-react';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  triggers: string[];
  steps: number;
  lastRun: string;
  executions: number;
  successRate: number;
  creator: string;
}

const workflows: Workflow[] = [
  {
    id: '1',
    name: 'Customer Onboarding',
    description: 'Automated customer onboarding process with document verification',
    status: 'active',
    triggers: ['New customer', 'Form submission'],
    steps: 8,
    lastRun: '2 hours ago',
    executions: 142,
    successRate: 98,
    creator: 'Alex Kim'
  },
  {
    id: '2',
    name: 'Invoice Processing',
    description: 'Extract data from invoices and update accounting system',
    status: 'active',
    triggers: ['Email', 'File upload'],
    steps: 6,
    lastRun: '1 hour ago',
    executions: 243,
    successRate: 94,
    creator: 'Sarah Patel'
  },
  {
    id: '3',
    name: 'Lead Qualification',
    description: 'Qualify and score new leads based on criteria',
    status: 'inactive',
    triggers: ['CRM event', 'Manual trigger'],
    steps: 4,
    lastRun: '2 days ago',
    executions: 65,
    successRate: 87,
    creator: 'Alex Kim'
  },
  {
    id: '4',
    name: 'Social Media Content',
    description: 'Generate and schedule social media content from templates',
    status: 'draft',
    triggers: ['Schedule', 'Manual trigger'],
    steps: 7,
    lastRun: 'Never',
    executions: 0,
    successRate: 0,
    creator: 'Jamie Vo'
  },
  {
    id: '5',
    name: 'Support Ticket Triage',
    description: 'Categorize and route support tickets based on content',
    status: 'active',
    triggers: ['New ticket', 'Webhook'],
    steps: 5,
    lastRun: '3 hours ago',
    executions: 312,
    successRate: 99,
    creator: 'Carlos Rodriguez'
  }
];

const WorkflowStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-indigo-800/30 border-indigo-800/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-500/20">
              <Activity className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Workflows</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-indigo-800/30 border-indigo-800/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/20">
              <CheckCircle2 className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Monthly Executions</p>
              <p className="text-2xl font-bold text-white">5,238</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-indigo-800/30 border-indigo-800/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-500/20">
              <CheckCircle2 className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Average Success Rate</p>
              <p className="text-2xl font-bold text-white">94%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const WorkflowsTable = ({ workflows }: { workflows: Workflow[] }) => {
  return (
    <GlassPanel className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-indigo-900/50">
            <TableRow className="border-b-indigo-700 hover:bg-transparent">
              <TableHead className="text-white font-medium w-[250px]">Workflow</TableHead>
              <TableHead className="text-white font-medium">Status</TableHead>
              <TableHead className="text-white font-medium">Trigger</TableHead>
              <TableHead className="text-white font-medium">Steps</TableHead>
              <TableHead className="text-white font-medium">Success Rate</TableHead>
              <TableHead className="text-white font-medium">Last Run</TableHead>
              <TableHead className="text-white font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map((workflow) => (
              <TableRow key={workflow.id} className="border-b-indigo-700/50 hover:bg-indigo-800/30">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="text-white">{workflow.name}</span>
                    <span className="text-xs text-gray-400">{workflow.description}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      workflow.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : workflow.status === 'inactive'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }
                  >
                    {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {workflow.triggers.map((trigger, i) => (
                      <Badge key={i} variant="secondary" className="bg-indigo-700/50 text-blue-300 border-0">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{workflow.steps}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={workflow.successRate} 
                      className="h-2 w-16" 
                    />
                    <span className="text-sm text-gray-300">{workflow.successRate}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-gray-300">
                    <Clock className="mr-1 h-3 w-3" />
                    {workflow.lastRun}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400">
                      <Play className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-indigo-900/90 backdrop-blur-md border-indigo-700 text-white">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-indigo-700" />
                        <DropdownMenuItem className="focus:bg-indigo-800">
                          <FileCode className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-indigo-800">
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Duplicate</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-indigo-800">
                          <Share2 className="mr-2 h-4 w-4" />
                          <span>Share</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-indigo-700" />
                        <DropdownMenuItem className="text-red-400 focus:bg-red-950/50 focus:text-red-400">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </GlassPanel>
  );
};

const RecentExecutions = () => {
  return (
    <Card className="bg-indigo-800/30 border-indigo-800/50 w-full">
      <CardHeader>
        <CardTitle className="text-white text-lg">Recent Executions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { workflow: 'Customer Onboarding', time: '12:45 PM', success: true, duration: '45s' },
            { workflow: 'Invoice Processing', time: '11:32 AM', success: true, duration: '28s' },
            { workflow: 'Support Ticket Triage', time: '10:15 AM', success: true, duration: '12s' },
            { workflow: 'Invoice Processing', time: '9:20 AM', success: false, duration: '55s' },
            { workflow: 'Customer Onboarding', time: '8:45 AM', success: true, duration: '42s' },
          ].map((execution, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded bg-indigo-800/50">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${execution.success ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <p className="text-white font-medium">{execution.workflow}</p>
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Today at {execution.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300">{execution.duration}</span>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-indigo-700/50 pt-4">
        <Button variant="ghost" className="w-full text-blue-300 hover:text-blue-100 hover:bg-blue-800/20">
          View All Executions
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function WorkflowsClient() {
  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Workflows</h1>
          <p className="text-slate-400 mt-1">Create and manage AI-powered automation workflows</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </header>
      
      <WorkflowStats />
      
      <GlassPanel className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search workflows..."
              className="w-full pl-10 pr-4 py-2 bg-indigo-800/30 border border-indigo-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-indigo-700 text-white">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={18} />
            </Button>
          </div>
        </div>
      </GlassPanel>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorkflowsTable workflows={workflows} />
        </div>
        <div>
          <RecentExecutions />
        </div>
      </div>
    </div>
  );
} 