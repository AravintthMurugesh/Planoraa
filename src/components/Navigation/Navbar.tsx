import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Bell,
  Sun,
  Moon,
  Settings,
  CheckCircle2,
  Calendar as CalendarIcon,
  BookOpen,
  Menu,
  LogOut,
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronDown,
  Search,
  Command,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onMobileMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const {
    settings,
    updateSettings,
    profile,
    setQuickTaskModalOpen,
    setActiveTab,
    setCommandPaletteOpen,
    activities,
    overdueTasks,
    logout,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentSeconds, setCurrentSeconds] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      );
      setCurrentSeconds(String(now.getSeconds()).padStart(2, '0'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-30 w-full px-3 sm:px-6 pt-3 pb-2 transition-all">
      <div className="max-w-[1600px] mx-auto h-16 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/10 px-3 sm:px-5 flex items-center justify-between gap-3">
        {/* ---------- Left: Mobile toggle + Brand ---------- */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 rounded-xl transition-all border border-slate-200/80 dark:border-white/5 cursor-pointer btn-press"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--accent-color)] to-[var(--accent-hover)] shadow-lg shadow-[var(--accent-soft)] flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="w-4.5 h-4.5" strokeWidth={2.4} />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-black text-[17px] text-slate-900 dark:text-white tracking-tight leading-none transition-colors">
                Planora
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide leading-none mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                Productivity Suite
              </span>
            </div>
          </div>
        </div>

        {/* ---------- Right: actions ---------- */}
        <div className="flex items-center gap-2">
          {/* Command palette trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden lg:flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 transition-all cursor-pointer group"
            title="Open Command Palette (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">Quick search…</span>
            <kbd className="ml-1 px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-white/10 text-slate-600 dark:text-slate-300 font-mono text-[9px] font-bold flex items-center gap-0.5">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* Live clock */}
          {currentTime && (
            <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-inner">
              <Clock className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tabular-nums tracking-tight">
                {currentTime}
              </span>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 tabular-nums">
                {currentSeconds}
              </span>
            </div>
          )}

          {/* Quick add task */}
          <button
            onClick={() => setQuickTaskModalOpen(true)}
            className="relative group p-[1px] rounded-xl overflow-hidden shadow-lg shadow-[var(--accent-soft)] active:scale-95 transition-transform cursor-pointer btn-press"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent-color)] via-[var(--accent-color)] to-[var(--accent-hover)] rounded-xl group-hover:opacity-90 transition-opacity" />
            <div className="relative px-3.5 py-2 bg-slate-950/80 hover:bg-slate-950/60 rounded-[11px] text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-colors">
              <Plus className="w-4 h-4 text-white stroke-[3]" />
              <span className="hidden sm:inline">New Task</span>
            </div>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer btn-press"
            title={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--accent-color)]" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2.5 rounded-xl bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer btn-press"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {overdueTasks.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950">
                  {overdueTasks.length > 1 && (
                    <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping" />
                  )}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.97 }}
                  transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel shadow-2xl py-3 z-50 border border-slate-200/80 dark:border-white/10 overflow-hidden"
                >
                  <div className="px-4 pb-3 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[var(--accent-soft)] text-[var(--accent-color)]">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Notifications
                      </span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent-color)] border border-[var(--accent-soft)]">
                      {overdueTasks.length > 0 ? `${overdueTasks.length} Overdue` : 'All Clean'}
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-200/60 dark:divide-white/5">
                    {overdueTasks.length > 0 && (
                      <div className="p-3 bg-rose-500/10 border-l-4 border-rose-500 flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                            Attention Required
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                            You have {overdueTasks.length} overdue item(s) in your pipeline.
                          </p>
                        </div>
                      </div>
                    )}

                    {activities.length === 0 && overdueTasks.length === 0 && (
                      <div className="p-8 text-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-900/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-xs font-semibold text-slate-400">
                          Nothing here yet — your activity will appear.
                        </p>
                      </div>
                    )}

                    {activities.slice(0, 5).map((act) => (
                      <div
                        key={act.id}
                        className="p-3 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors flex gap-3 items-start"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-900/5 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                          {act.type === 'task_completed' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                          )}
                          {act.type === 'event_added' && (
                            <CalendarIcon className="w-4 h-4 text-[var(--accent-color)]" />
                          )}
                          {act.type === 'note_created' && (
                            <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                          )}
                          {act.type === 'task_created' && (
                            <Plus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate">
                            {act.title}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {act.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 pl-1 pr-1.5 rounded-xl bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer btn-press"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
                  <span className="text-[11px] font-black text-[var(--accent-color)]">
                    {profile.name.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-950" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:block" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.97 }}
                  transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 mt-3 w-64 rounded-2xl glass-panel shadow-2xl p-3 z-50 border border-slate-200/80 dark:border-white/10"
                >
                  <div className="flex items-center gap-3 p-2.5 bg-[var(--accent-soft)] rounded-xl mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)] flex items-center justify-center shrink-0 shadow-md">
                      <span className="text-white font-black text-lg">
                        {profile.name.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {profile.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {profile.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5 rounded-xl transition-colors flex items-center justify-between"
                    >
                      <span>Settings & Profile</span>
                      <Settings className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center justify-between"
                    >
                      <span>Sign Out</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};