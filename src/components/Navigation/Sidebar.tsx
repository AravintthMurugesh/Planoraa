import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewTab } from '../../types';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const { activeTab, setActiveTab, activeTasks, notes, overdueTasks } = useApp();

  const primaryNavItems: { id: ViewTab; label: string; icon: React.FC<{ className?: string }>; badge?: number | string }[] = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'todo', label: 'Tasks Matrix', icon: CheckSquare, badge: activeTasks.length },
    { id: 'tracker', label: 'Task Flow', icon: Kanban, badge: overdueTasks.length > 0 ? `${overdueTasks.length} Alert` : undefined },
    { id: 'calendar', label: 'Calendar Grid', icon: Calendar },
    { id: 'timetable', label: 'Schedule Hub', icon: Clock },
    { id: 'notes', label: 'Notes', icon: FileText, badge: notes.length },
  ];

  const collectionNavItems: { id: ViewTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'favorites', label: 'Starred Items', icon: Star },
    { id: 'archive', label: 'Vault Archive', icon: Archive },
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
        className={`relative w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs transition-all duration-300 group cursor-pointer mb-1 ${
          isActive
            ? 'text-indigo-600 dark:text-white'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeDockGlow"
            className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/10 border border-indigo-500/40 rounded-xl shadow-lg shadow-indigo-500/20 backdrop-blur-md"
            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
          />
        )}

        <div className="relative z-10 flex items-center gap-3">
          <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/30 dark:text-indigo-300' : 'bg-slate-900/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:bg-slate-900/10 dark:group-hover:bg-white/10'}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="tracking-wide">{item.label}</span>
        </div>

        {item.badge !== undefined && (
          <span
            className={`relative z-10 text-[10px] font-black px-2 py-0.5 rounded-full transition-all ${
              isActive
                ? 'bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/30 dark:text-indigo-200 border border-indigo-400/40'
                : item.badge.toString().includes('Alert')
                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 animate-pulse'
                : 'bg-slate-900/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-white/10'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const sidebarContent = (
    <aside className="w-64 h-full rounded-2xl glass-panel border border-slate-200/80 dark:border-white/10 flex flex-col justify-between p-4 select-none shadow-2xl overflow-y-auto">
      <div className="space-y-4">
        {/* Mobile Header */}
        <div className="px-2 py-1 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">Navigation Dock</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-900/10 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
            <span>Core Modules</span>
          </div>
          <nav className="space-y-0.5">
            {primaryNavItems.map(renderNavItem)}
          </nav>
        </div>

        <div>
          <div className="mt-4 px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm" />
            <span>Spaces & Archives</span>
          </div>
          <nav className="space-y-0.5">
            {collectionNavItems.map(renderNavItem)}
          </nav>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Floating Sidebar */}
      <div className="hidden md:block h-[calc(100vh-5.5rem)] sticky top-20 py-3 pl-4 pr-2">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative z-10 w-72 h-full p-4"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
