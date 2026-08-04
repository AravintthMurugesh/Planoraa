import React, { useState } from 'react';
import {
  Search,
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
} from 'lucide-react';
import { useApp } from '../../context/appcontext.tsx';

interface NavbarProps {
  onMobileMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const {
    settings,
    updateSettings,
    profile,
    setCommandPaletteOpen,
    setQuickTaskModalOpen,
    setActiveTab,
    activities,
    overdueTasks,
    logout,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-30 h-18 bg-[#F1F5F9]/90 dark:bg-[#0B0F17]/90 backdrop-blur-md border-b border-[#CBD5E1] dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between gap-4 transition-colors">
      {/* Left section: Mobile menu button & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <img
            src="/src/assets/images/planora_logo_1784957089188.jpg"
            alt="Planora Logo"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 shadow-sm group-hover:scale-105 transition-transform shrink-0"
          />
          <div className="flex flex-col justify-center">
            <span className="font-bold text-base sm:text-lg text-[#111827] dark:text-white tracking-tight leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Planora
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight leading-none">
              Your all-in-one planning workspace.
            </span>
          </div>
        </div>
      </div>

      {/* Middle section: Search trigger bar */}
      <div className="flex-1 max-w-md hidden sm:block">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-80 flex items-center justify-between px-4 py-2 bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300/70 dark:hover:bg-slate-800 rounded-xl text-[#334155] dark:text-slate-300 text-sm transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="font-medium">Search anything...</span>
          </div>
          <kbd className="hidden md:inline-flex items-center text-[10px] opacity-70 font-semibold">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="sm:hidden w-10 h-10 rounded-xl border border-[#CBD5E1] dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-2xs"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Quick Add Task Button */}
        <button
          onClick={() => setQuickTaskModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl border border-[#CBD5E1] dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-2xs transition-colors cursor-pointer"
          title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-10 h-10 rounded-xl border border-[#CBD5E1] dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-2xs relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {overdueTasks.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-100 dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xl py-2 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  {overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : 'Up to date'}
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                {overdueTasks.length > 0 && (
                  <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      ⚠️
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">Attention Needed</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        You have {overdueTasks.length} task(s) past due date.
                      </p>
                    </div>
                  </div>
                )}

                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                      {act.type === 'task_completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {act.type === 'event_added' && <CalendarIcon className="w-4 h-4 text-indigo-500" />}
                      {act.type === 'note_created' && <BookOpen className="w-4 h-4 text-amber-500" />}
                      {act.type === 'task_created' && <Plus className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate">{act.title}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{act.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>



        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50">
              <div className="flex items-center gap-3 p-2">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{profile.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{profile.email}</p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Edit Profile & Preferences</span>
                  <Settings className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Sign Out</span>
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
