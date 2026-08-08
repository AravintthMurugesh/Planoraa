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
    activities,
    overdueTasks,
    logout,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-30 w-full px-4 sm:px-6 pt-3 pb-2 transition-all">
      <div className="max-w-[1600px] mx-auto h-16 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-indigo-950/20 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 rounded-xl transition-all border border-slate-200/80 dark:border-white/5"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-indigo-600 dark:from-white dark:via-slate-100 dark:to-indigo-200">
                  Planora
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide leading-none mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                Productivity Suite
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Time Badge, New Task, Notifications, Theme, User */}
        <div className="flex items-center gap-2.5">
          {/* Live Clock Badge */}
          {currentTime && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-inner">
              <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 animate-pulse" />
              <span>{currentTime}</span>
            </div>
          )}

          {/* Quick Add Task Button */}
          <button
            onClick={() => setQuickTaskModalOpen(true)}
            className="relative group p-[1px] rounded-xl overflow-hidden shadow-xl shadow-indigo-500/25 active:scale-95 transition-transform cursor-pointer"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-xl group-hover:opacity-90 transition-opacity" />
            <div className="relative px-3.5 py-1.5 bg-slate-950/80 hover:bg-slate-950/60 rounded-[11px] text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-colors">
              <Plus className="w-4 h-4 text-indigo-400 stroke-[3]" />
              <span className="hidden sm:inline">New Task</span>
            </div>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs"
            title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            )}
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-xl bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all relative cursor-pointer shadow-xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {overdueTasks.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-ping" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel shadow-2xl py-3 z-50 border border-slate-200/80 dark:border-white/10"
                >
                  <div className="px-4 pb-3 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">Notifications Hub</span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-500/30">
                      {overdueTasks.length > 0 ? `${overdueTasks.length} Overdue` : 'All Clean'}
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-200/60 dark:divide-white/5">
                    {overdueTasks.length > 0 && (
                      <div className="p-3 bg-rose-500/10 border-l-4 border-rose-500 flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0">
                          ⚠️
                        </div>
                        <div>
                          <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Attention Required</p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                            You have {overdueTasks.length} overdue item(s) in your pipeline.
                          </p>
                        </div>
                      </div>
                    )}

                    {activities.slice(0, 5).map((act) => (
                      <div key={act.id} className="p-3 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-lg bg-slate-900/5 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                          {act.type === 'task_completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
                          {act.type === 'event_added' && <CalendarIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />}
                          {act.type === 'note_created' && <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />}
                          {act.type === 'task_created' && <Plus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate">{act.title}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{act.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-all"
            >
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/50"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-950" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:block" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-64 rounded-2xl glass-panel shadow-2xl p-3 z-50 border border-slate-200/80 dark:border-white/10"
                >
                  <div className="flex items-center gap-3 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-2">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/50"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{profile.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{profile.email}</p>
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
                      <Settings className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
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

