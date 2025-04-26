import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calendar | BizOS',
  description: 'Manage your schedule and appointments',
};

export default function CalendarPage() {
  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calendar</h1>
          <p className="text-muted-foreground">View and manage your schedule and appointments</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90">
          New Event
        </button>
      </header>
      
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
        <p className="text-muted-foreground mb-6">This page is under development. Calendar functionality will be available soon.</p>
      </div>
    </div>
  );
} 