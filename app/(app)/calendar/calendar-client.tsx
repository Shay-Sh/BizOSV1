'use client';

import { useState } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Plus, MoreHorizontal, Search, Filter, Clock, Users,
  MapPin, Video, Tag, PlusCircle
} from 'lucide-react';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Types
interface Event {
  id: string;
  title: string;
  description?: string;
  start: string; // Time string like "09:00 AM"
  end: string;   // Time string like "10:30 AM"
  date: string;  // "Today", "Tomorrow", etc.
  type: 'meeting' | 'task' | 'reminder' | 'deadline';
  location?: string;
  attendees?: { name: string; avatar?: string }[];
  isVirtual?: boolean;
  isAllDay?: boolean;
  tags?: string[];
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
  events?: Event[];
}

// Sample data
const events: Event[] = [
  {
    id: '1',
    title: 'Team Weekly Sync',
    description: 'Discuss project progress and roadblocks',
    start: '09:00 AM',
    end: '10:00 AM',
    date: 'Today',
    type: 'meeting',
    location: 'Conference Room A',
    attendees: [
      { name: 'Alex Kim', avatar: '/avatars/alex.jpg' },
      { name: 'Sarah Patel', avatar: '/avatars/sarah.jpg' },
      { name: 'Jamie Vo', avatar: '/avatars/jamie.jpg' },
      { name: 'Carlos Rodriguez', avatar: '/avatars/carlos.jpg' },
    ],
    isVirtual: true,
    tags: ['Important', 'Planning']
  },
  {
    id: '2',
    title: 'Client Presentation: FinTech Solutions',
    start: '11:30 AM',
    end: '12:30 PM',
    date: 'Today',
    type: 'meeting',
    isVirtual: true,
    attendees: [
      { name: 'Alex Kim', avatar: '/avatars/alex.jpg' },
      { name: 'Sarah Patel', avatar: '/avatars/sarah.jpg' },
      { name: 'External Client', avatar: '/avatars/client.jpg' },
    ],
    tags: ['Client', 'Presentation']
  },
  {
    id: '3',
    title: 'Complete Q2 Reports',
    start: '02:00 PM',
    end: '04:00 PM',
    date: 'Today',
    type: 'task',
    tags: ['Deadline', 'Finance']
  },
  {
    id: '4',
    title: 'Product Roadmap Review',
    start: '10:00 AM',
    end: '11:30 AM',
    date: 'Tomorrow',
    type: 'meeting',
    location: 'Main Meeting Room',
    attendees: [
      { name: 'Alex Kim', avatar: '/avatars/alex.jpg' },
      { name: 'Product Team', avatar: '/avatars/team.jpg' },
    ],
    tags: ['Product', 'Planning']
  },
  {
    id: '5',
    title: 'System Maintenance',
    date: 'Tomorrow',
    type: 'reminder',
    start: '00:00 AM',
    end: '11:59 PM',
    isAllDay: true,
    tags: ['IT', 'Maintenance']
  }
];

// Sample calendar days
const generateCalendarDays = (): CalendarDay[] => {
  const days: CalendarDay[] = [];
  
  // Previous month days
  for (let i = 25; i <= 31; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      hasEvents: Math.random() > 0.7
    });
  }
  
  // Current month days
  const totalDays = 30; // Assuming 30 days in the current month
  for (let i = 1; i <= totalDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: i === 15, // Assuming today is the 15th
      hasEvents: Math.random() > 0.6
    });
  }
  
  // Next month days
  for (let i = 1; i <= 5; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      hasEvents: Math.random() > 0.7
    });
  }
  
  return days;
};

const calendarDays = generateCalendarDays();

// Components
const EventItem = ({ event }: { event: Event }) => {
  const typeColors = {
    meeting: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    task: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    reminder: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    deadline: 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  
  return (
    <div className="p-3 rounded-md bg-indigo-800/40 border border-indigo-700/50 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-white">{event.title}</h4>
          <div className="flex items-center text-sm text-gray-400 mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {event.isAllDay ? (
              <span>All day</span>
            ) : (
              <span>{event.start} - {event.end}</span>
            )}
          </div>
          
          {event.location && (
            <div className="flex items-center text-sm text-gray-400 mt-1">
              {event.isVirtual ? (
                <Video className="h-3 w-3 mr-1" />
              ) : (
                <MapPin className="h-3 w-3 mr-1" />
              )}
              <span>{event.location}</span>
            </div>
          )}
        </div>
        
        <Badge variant="outline" className={typeColors[event.type]}>
          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </Badge>
      </div>
      
      {event.attendees && event.attendees.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center mb-1">
            <Users className="h-3 w-3 mr-1 text-gray-400" />
            <span className="text-xs text-gray-400">Attendees:</span>
          </div>
          <div className="flex -space-x-2">
            {event.attendees.map((attendee, i) => (
              <Avatar 
                key={i} 
                className="border-2 border-indigo-900 h-6 w-6" 
              />
            ))}
            {event.attendees.length > 4 && (
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-700 text-xs text-white border-2 border-indigo-900">
                +{event.attendees.length - 4}
              </div>
            )}
          </div>
        </div>
      )}
      
      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {event.tags.map((tag, i) => (
            <div key={i} className="flex items-center text-xs bg-indigo-700/50 text-blue-300 px-2 py-0.5 rounded">
              <Tag className="h-2 w-2 mr-1" />
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CalendarGrid = () => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <GlassPanel className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-white mr-2">June 2023</h2>
          <Badge className="bg-indigo-600 text-white hover:bg-indigo-700">Today</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 border-indigo-700">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 border-indigo-700">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {weekdays.map((day, i) => (
          <div key={i} className="text-center text-sm font-medium text-gray-400 pb-2">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day, i) => (
          <div 
            key={i} 
            className={`
              aspect-square p-1.5 rounded-md text-sm font-medium flex flex-col items-center
              ${day.isCurrentMonth ? 'text-white' : 'text-gray-500'} 
              ${day.isToday ? 'bg-blue-600/20 border border-blue-500' : day.hasEvents ? 'bg-indigo-800/30' : ''}
            `}
          >
            <span className={`h-6 w-6 flex items-center justify-center rounded-full ${day.isToday ? 'bg-blue-600 text-white' : ''}`}>
              {day.date}
            </span>
            {day.hasEvents && (
              <div className="mt-1 w-full">
                {day.isToday && (
                  <div className="w-full h-1.5 bg-blue-500 rounded-full mb-1"></div>
                )}
                <div className="w-full h-1 bg-purple-500/70 rounded-full mb-1"></div>
                {Math.random() > 0.5 && (
                  <div className="w-full h-1 bg-amber-500/70 rounded-full"></div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

const UpcomingEvents = ({ events }: { events: Event[] }) => {
  return (
    <Card className="bg-indigo-800/30 border-indigo-800/50">
      <CardHeader>
        <CardTitle className="text-white text-lg">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </CardContent>
    </Card>
  );
};

export default function CalendarClient() {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  
  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Calendar</h1>
          <p className="text-slate-400 mt-1">Manage your schedule and events</p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex border border-indigo-700 rounded-md overflow-hidden">
            <Button 
              variant={viewMode === 'month' ? 'default' : 'ghost'} 
              size="sm"
              className={viewMode === 'month' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-indigo-800/50'}
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button 
              variant={viewMode === 'week' ? 'default' : 'ghost'} 
              size="sm"
              className={viewMode === 'week' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-indigo-800/50'}
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button 
              variant={viewMode === 'day' ? 'default' : 'ghost'} 
              size="sm"
              className={viewMode === 'day' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-indigo-800/50'}
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </header>
      
      <GlassPanel className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 bg-indigo-800/30 border border-indigo-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-indigo-700 text-white">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="border-indigo-700 text-white">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Today
            </Button>
          </div>
        </div>
      </GlassPanel>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarGrid />
        </div>
        <div>
          <UpcomingEvents events={events} />
        </div>
      </div>
    </div>
  );
} 