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
} from 'lucide-react';
import { useApp } from '../../context/appcontext.tsx';
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
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Workspace Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize themes, notifications, and personal profile information.
        </p>
      </div>

      {/* 1. Theme */}
      <div className="glass-card p-6 space-y-6">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" /> Appearance & Styling
        </h3>

        {/* Theme selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Theme Mode
          </label>
          <div className="grid grid-cols-3 gap-3">
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
                  onClick={() => updateSettings({ theme: t.id as ThemeMode })}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. User Profile Editor */}
      <form onSubmit={handleSaveProfile} className="glass-card p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500" /> User Profile Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold uppercase">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold uppercase">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold uppercase">Role / Position</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold uppercase">Avatar Image URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-medium"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </form>

      {/* 3. Notification Preferences */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-500" /> Notifications & Sound Alerts
        </h3>

        <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
          <div className="pt-2 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Task Due Date Reminders</p>
              <p className="text-slate-400">Receive alerts when tasks approach deadline</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.taskReminders}
              onChange={(e) =>
                updateSettings({
                  notifications: { ...settings.notifications, taskReminders: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-indigo-600"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Calendar Meeting Alerts</p>
              <p className="text-slate-400">Notify 15 minutes before scheduled meetings</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.calendarAlerts}
              onChange={(e) =>
                updateSettings({
                  notifications: { ...settings.notifications, calendarAlerts: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* 4. Keyboard Shortcuts Guide */}
      <div className="glass-card p-6 space-y-3">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-indigo-500" /> Essential Keyboard Shortcuts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Open Command Palette</span>
            <kbd className="font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200">⌘K / Ctrl+K</kbd>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Quick Create Task</span>
            <kbd className="font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200">New Task Button</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
