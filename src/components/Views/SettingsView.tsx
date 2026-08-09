import React from 'react';
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  User,
  Sun,
  Moon,
  Check,
  ShieldCheck,
  Monitor,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeMode, AccentColor } from '../../types';
import { ACCENT_META } from '../../lib/meta';
import { cn } from '../../lib/utils';

const THEME_OPTIONS: { id: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'light', label: 'Light Mode', icon: Sun },
  { id: 'dark', label: 'Dark Mode', icon: Moon },
  { id: 'system', label: 'System Default', icon: Monitor },
];

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, profile, setProfile } = useApp();

  return (
    <div className="space-y-6 pb-12 max-w-4xl animate-fade-up">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-[var(--accent-color)]" />
          <span>Settings & Preferences</span>
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          Customize themes, accent colors, notification alerts, and personal profile information.
        </p>
      </div>

      {/* 1. Appearance */}
      <div className="glass-card p-6 space-y-6">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-color)]">
            <Palette className="w-4 h-4" />
          </span>
          <span>Appearance & Styling</span>
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Theme Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {THEME_OPTIONS.map((t) => {
                const Icon = t.icon;
                const isSelected = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => updateSettings({ theme: t.id })}
                    className={cn(
                      'p-4 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer btn-press card-lift',
                      isSelected
                        ? 'border-[var(--accent-color)] bg-[var(--accent-soft)] text-[var(--accent-color)] shadow-sm'
                        : 'border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-[var(--accent-color)]/40'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Accent Color
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {(Object.keys(ACCENT_META) as AccentColor[]).map((accent) => {
                const meta = ACCENT_META[accent];
                const isSelected = settings.accentColor === accent;
                return (
                  <button
                    key={accent}
                    type="button"
                    onClick={() => updateSettings({ accentColor: accent })}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer btn-press card-lift',
                      isSelected
                        ? 'border-[var(--accent-color)] bg-[var(--accent-soft)] shadow-sm'
                        : 'border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/60 hover:border-[var(--accent-color)]/40'
                    )}
                  >
                    <span
                      className={cn(
                        'w-7 h-7 rounded-full shadow-inner transition-transform',
                        meta.swatch,
                        isSelected && 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-[var(--accent-color)]'
                      )}
                    />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Profile */}
      <div className="glass-card p-6 space-y-5">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-color)]">
            <User className="w-4 h-4" />
          </span>
          <span>User Profile Information</span>
        </h3>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-color)] flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
            {profile.name.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{profile.name}</p>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Full Name</label>
            <div className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white">
              {profile.name}
            </div>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Email Address</label>
            <div className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white">
              {profile.email}
            </div>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Role / Position</label>
            <input
              type="text"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50"
            />
          </div>

          {profile.provider && (
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Provider</label>
              <div className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white capitalize flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {profile.provider}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Notifications */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-color)]">
            <Bell className="w-4 h-4" />
          </span>
          <span>Notifications & Sound Alerts</span>
        </h3>

        <div className="space-y-3 divide-y divide-slate-200/80 dark:divide-white/10 text-xs">
          <div className="pt-2 flex items-center justify-between gap-4">
            <div>
              <p className="font-extrabold text-slate-900 dark:text-white">Task Due Date Reminders</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Receive notifications when tasks approach deadline
              </p>
            </div>
            <Toggle
              checked={settings.notifications.taskReminders}
              onChange={(checked) =>
                updateSettings({
                  notifications: { ...settings.notifications, taskReminders: checked },
                })
              }
            />
          </div>

          <div className="pt-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-extrabold text-slate-900 dark:text-white">Calendar Meeting Alerts</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Notify 15 minutes before scheduled meetings
              </p>
            </div>
            <Toggle
              checked={settings.notifications.calendarAlerts}
              onChange={(checked) =>
                updateSettings({
                  notifications: { ...settings.notifications, calendarAlerts: checked },
                })
              }
            />
          </div>
        </div>
      </div>

      </div>
  );
};

const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({
  checked,
  onChange,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={cn(
      'relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 border',
      checked
        ? 'bg-[var(--accent-color)] border-transparent'
        : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-white/10'
    )}
  >
    <span
      className={cn(
        'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all',
        checked ? 'left-[22px]' : 'left-0.5'
      )}
    />
  </button>
);