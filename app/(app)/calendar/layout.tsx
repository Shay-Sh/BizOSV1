import { ReactNode } from 'react';

interface CalendarLayoutProps {
  children: ReactNode;
}

export default function CalendarLayout({ children }: CalendarLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <header className="p-6 pb-0">
        <h1 className="text-3xl font-bold text-white">Calendar</h1>
        <p className="text-slate-400 mt-1">Manage your schedule and events with BizOS Calendar</p>
      </header>
      <main className="flex-grow p-6">
        {children}
      </main>
    </div>
  );
} 