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
  Layers,
  Gem,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewTab } from '../../types';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  id: ViewTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const { activeTab, setActiveTab, activeTasks, notes, overdueTasks, settings } = useApp();

  const primaryNavItems: NavItem[] = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'todo', label: 'Tasks Matrix', icon: CheckSquare, badge: activeTasks.length },
    {
      id: 'tracker',
      label: 'Task Flow',
      icon: Kanban,
      badge: overdueTasks.length > 0 ? `${overdueTasks.length} Alert` : undefined,
    },
    { id: 'calendar', label: 'Calendar Grid', icon: Calendar },
    { id: 'timetable', label: 'Schedule Hub', icon: Clock },
    { id: 'notes', label: 'Notes', icon: FileText, badge: notes.length },
  ];

  const collectionNavItems: NavItem[] = [
    { id: 'favorites', label: 'Starred Items', icon: Star },
    { id: 'archive', label: 'Vault Archive', icon: Archive },
  ];

  const handleSelect = (id: ViewTab) => {
    setActiveTab(id);
    onMobileClose();
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    const isAlert = typeof item.badge === 'string' && item.badge.includes('Alert');

    return (
      <button
        key={item.id}
        onClick={() => handleSelect(item.id)}
        className={cn(
          'relative w-full flex items-center justify-between pl-2.5 pr-3 py-2.5 rounded-2xl font-semibold text-[13px] transition-all duration-300 group cursor-pointer mb-0.5',
          isActive
            ? 'text-slate-900 dark:text-white font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5'
        )}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active-pill"
            className="absolute inset-0 bg-gradient-to-r from-[var(--accent-soft)] via-[var(--accent-soft)] to-transparent border-b border-[var(--accent-soft)] rounded-2xl shadow-lg shadow-[var(--accent-soft)]"
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
        )}

        <div className="relative z-10 flex items-center gap-3 min-w-0">
          <div
            className={cn(
              'p-2 rounded-xl transition-all duration-300',
              isActive
                ? 'bg-[var(--accent-color)] text-white shadow-md shadow-[var(--accent-soft)] scale-105'
                : 'bg-slate-900/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:bg-slate-900/10 dark:group-hover:bg-white/10'
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span className="tracking-tight truncate">{item.label}</span>
        </div>

        {item.badge !== undefined && (
          <span
            className={cn(
              'relative z-10 text-[10px] font-black px-2 py-0.5 rounded-full transition-all shrink-0',
              isActive
                ? 'bg-white/90 text-[var(--accent-color)] shadow-sm'
                : isAlert
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 animate-pulse'
                  : 'bg-slate-900/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-white/10'
            )}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const sidebarContent = (
    <aside className="w-64 h-full rounded-2xl glass-panel border border-slate-200/80 dark:border-white/10 flex flex-col justify-between p-3.5 select-none overflow-y-auto">
      <div className="space-y-5">
        {/* Mobile Header */}
        <div className="px-2 py-1 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--accent-color)] to-[var(--accent-hover)] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
              Planora
            </span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-900/10 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core modules */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-[var(--accent-color)]" />
            <span>Core Modules</span>
          </div>
          <nav className="space-y-0.5">{primaryNavItems.map(renderNavItem)}</nav>
        </div>

        {/* Collections */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Gem className="w-3 h-3 text-[var(--accent-color)]" />
            <span>Spaces & Archives</span>
          </div>
          <nav className="space-y-0.5">{collectionNavItems.map(renderNavItem)}</nav>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop floating sidebar */}
      <div className="hidden md:block h-[calc(100vh-5.5rem)] sticky top-20 py-3 pl-4 pr-2">
        {sidebarContent}
      </div>

      {/* Mobile drawer */}
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