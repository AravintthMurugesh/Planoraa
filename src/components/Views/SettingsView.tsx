import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  User,
  Sun,
  Moon,
  Save,
  Keyboard,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeMode } from '../../types';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, profile, setProfile, addToast } = useApp();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [role, setRole] = useState(profile.role);
  const [avatar, setAvatar] = useState(profile.avatar);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ name, email, role, avatar });
    addToast('Profile updated successfully', 'success');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-indigo-500" />
          <span>Settings & Preferences</span>
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          Customize themes, notification alerts, and personal profile information.
        </p>
      </div>

      {/* 1. Theme */}
      <div className="glass-card p-6 space-y-6">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" />
          <span>Appearance & Styling</span>
        </h3>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Theme Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun },
              { id: 'dark', label: 'Dark Mode', icon: Moon },
              { id: 'system', label: 'System Default', icon: SettingsIcon },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = settings.theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => updateSettings({ theme: t.id as ThemeMode })}
                  className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-indigo-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-500 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. User Profile Editor */}
      <form onSubmit={handleSaveProfile} className="glass-card p-6 space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500" />
          <span>User Profile Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Role / Position</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Avatar Image URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* 3. Notification Preferences */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-500" />
          <span>Notifications & Sound Alerts</span>
        </h3>

        <div className="space-y-3 divide-y divide-slate-200/80 dark:divide-white/10 text-xs">
          <div className="pt-2 flex items-center justify-between">
            <div>
              <p className="font-extrabold text-slate-900 dark:text-white">Task Due Date Reminders</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Receive notifications when tasks approach deadline</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.taskReminders}
              onChange={(e) =>
                updateSettings({
                  notifications: { ...settings.notifications, taskReminders: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <p className="font-extrabold text-slate-900 dark:text-white">Calendar Meeting Alerts</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Notify 15 minutes before scheduled meetings</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.calendarAlerts}
              onChange={(e) =>
                updateSettings({
                  notifications: { ...settings.notifications, calendarAlerts: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. Keyboard Shortcuts */}
      <div className="glass-card p-6 space-y-3">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-indigo-500" />
          <span>Essential Keyboard Shortcuts</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 flex items-center justify-between">
            <span className="font-medium text-slate-600 dark:text-slate-300">Open Command Palette</span>
            <kbd className="font-mono px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-bold">⌘K / Ctrl+K</kbd>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 flex items-center justify-between">
            <span className="font-medium text-slate-600 dark:text-slate-300">Quick Create Task</span>
            <kbd className="font-mono px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-bold">New Task Button</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
