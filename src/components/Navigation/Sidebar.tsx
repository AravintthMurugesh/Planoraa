import React from 'react';
import {
  Home,
  CheckSquare,
  Kanban,
  Calendar,
  Clock,
  FileText,
  Star,
  Archive,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../../context/appcontext.tsx';
import { ViewTab } from '../../types';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const { activeTab, setActiveTab, activeTasks, notes, overdueTasks } = useApp();

  const primaryNavItems: { id: ViewTab; label: string; icon: React.FC<{ className?: string }>; badge?: number | string }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'todo', label: 'Todo List', icon: CheckSquare, badge: activeTasks.length },
    { id: 'tracker', label: 'Task Tracker', icon: Kanban, badge: overdueTasks.length > 0 ? `${overdueTasks.length} Overdue` : undefined },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'timetable', label: 'Timetable', icon: Clock },
    { id: 'notes', label: 'Notes', icon: FileText, badge: notes.length },
  ];

  const collectionNavItems: { id: ViewTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'archive', label: 'Archive', icon: Archive },
  ];

  const handleSelect = (id: ViewTab) => {
    setActiveTab(id);
    onMobileClose();
  };

  const renderNavItem = (item: { id: ViewTab; label: string; icon: React.FC<{ className?: string }>; badge?: number | string }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => handleSelect(item.id)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group cursor-pointer mb-1 ${
          isActive
            ? 'bg-[#F1F5F9] dark:bg-slate-800/80 text-[#4F46E5] dark:text-indigo-400 font-semibold'
            : 'text-[#6B7280] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon
            className={`w-4 h-4 transition-transform group-hover:scale-105 ${
              isActive ? 'text-[#4F46E5] dark:text-indigo-400' : 'text-[#6B7280] dark:text-slate-400'
            }`}
          />
          <span>{item.label}</span>
        </div>

        {item.badge !== undefined && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              isActive
                ? 'bg-[#4F46E5]/10 text-[#4F46E5] dark:bg-indigo-400/10 dark:text-indigo-300'
                : item.badge.toString().includes('Overdue')
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const sidebarContent = (
    <aside className="w-60 h-full bg-[#F1F5F9] dark:bg-[#0B0F17] border-r border-[#CBD5E1] dark:border-slate-800 flex flex-col justify-between p-4 select-none transition-colors">
      <div className="space-y-1">
        <div className="px-2 py-2 flex items-center justify-between md:hidden">
          <span className="font-semibold text-sm text-[#111827] dark:text-white">Navigation</span>
          <button
            onClick={onMobileClose}
            className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-1">
          {primaryNavItems.map(renderNavItem)}

          <div className="my-5 ml-3.5 text-[11px] font-bold text-[#6B7280] dark:text-slate-500 uppercase tracking-widest">
            Collections
          </div>

          {collectionNavItems.map(renderNavItem)}
        </nav>
      </div>

      {/* Bottom Productivity Tip Card */}
      <div className="p-4 rounded-2xl bg-slate-200/80 dark:bg-slate-800/40 border border-[#CBD5E1] dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-semibold text-[#4F46E5] dark:text-indigo-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Quick Shortcut</span>
        </div>
        <p className="text-[#6B7280] dark:text-slate-400 leading-relaxed text-[11px]">
          Press <kbd className="font-mono px-1 py-0.5 bg-slate-300 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">⌘K</kbd> anywhere to search or navigate.
        </p>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-[calc(100vh-4rem)] sticky top-16">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onMobileClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />
          <div className="relative z-10 w-64 h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
