import type {
  Priority,
  TaskStatus,
  AccentColor,
  CalendarEvent,
  TimetableSlot,
  DayOfWeek,
} from '../types';

interface PriorityMeta {
  label: string;
  badge: string;
  dot: string;
}

export const PRIORITY_META: Record<Priority, PriorityMeta> = {
  high: {
    label: 'High',
    badge:
      'bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-500/20',
    dot: 'bg-rose-500',
  },
  medium: {
    label: 'Medium',
    badge:
      'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-500/20',
    dot: 'bg-amber-500',
  },
  low: {
    label: 'Low',
    badge:
      'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
};

interface TaskStatusMeta {
  label: string;
  badge: string;
  dot: string;
}

export const TASK_STATUS_META: Record<TaskStatus, TaskStatusMeta> = {
  todo: {
    label: 'To Do',
    badge:
      'bg-slate-500/10 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300 border border-slate-500/20',
    dot: 'bg-slate-500',
  },
  in_progress: {
    label: 'In Progress',
    badge:
      'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 border border-indigo-500/20',
    dot: 'bg-indigo-500',
  },
  review: {
    label: 'Under Review',
    badge:
      'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-500/20',
    dot: 'bg-amber-500',
  },
  completed: {
    label: 'Completed',
    badge:
      'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
};

export const ACCENT_META: Record<
  AccentColor,
  {
    label: string;
    hex: string;
    gradient: string;
    foreground: string;
    swatch: string;
  }
> = {
  indigo: {
    label: 'Indigo',
    hex: '#6D5DF6',
    gradient: 'from-[#6D5DF6] via-[#8B5CF6] to-[#06B6D4]',
    foreground: 'text-[#6D5DF6] dark:text-[#8B9CF8]',
    swatch: 'bg-[#6D5DF6]',
  },
  violet: {
    label: 'Violet',
    hex: '#8B5CF6',
    gradient: 'from-[#8B5CF6] via-[#A855F7] to-[#EC4899]',
    foreground: 'text-[#8B5CF6] dark:text-[#A78BFA]',
    swatch: 'bg-[#8B5CF6]',
  },
  emerald: {
    label: 'Emerald',
    hex: '#10B981',
    gradient: 'from-[#10B981] via-[#14B8A6] to-[#3B82F6]',
    foreground: 'text-[#10B981] dark:text-[#34D399]',
    swatch: 'bg-[#10B981]',
  },
  rose: {
    label: 'Rose',
    hex: '#F43F5E',
    gradient: 'from-[#F43F5E] via-[#F97316] to-[#F59E0B]',
    foreground: 'text-[#F43F5E] dark:text-[#FB7185]',
    swatch: 'bg-[#F43F5E]',
  },
  amber: {
    label: 'Amber',
    hex: '#F59E0B',
    gradient: 'from-[#F59E0B] via-[#F97316] to-[#EF4444]',
    foreground: 'text-[#F59E0B] dark:text-[#FBBF24]',
    swatch: 'bg-[#F59E0B]',
  },
  slate: {
    label: 'Slate',
    hex: '#475569',
    gradient: 'from-[#475569] via-[#64748B] to-[#0EA5E9]',
    foreground: 'text-[#475569] dark:text-[#94A3B8]',
    swatch: 'bg-[#475569]',
  },
};

interface EventCategoryMeta {
  label: string;
  badge: string;
  swatch: string;
}

export const EVENT_CATEGORY_META: Record<CalendarEvent['category'], EventCategoryMeta> = {
  work: {
    label: 'Work',
    badge:
      'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 border border-indigo-500/20',
    swatch: 'bg-indigo-500',
  },
  personal: {
    label: 'Personal',
    badge:
      'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20',
    swatch: 'bg-emerald-500',
  },
  meeting: {
    label: 'Meeting',
    badge:
      'bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400 border border-violet-500/20',
    swatch: 'bg-violet-500',
  },
  study: {
    label: 'Study',
    badge:
      'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400 border border-cyan-500/20',
    swatch: 'bg-cyan-500',
  },
  holiday: {
    label: 'Holiday',
    badge:
      'bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400 border border-sky-500/20',
    swatch: 'bg-sky-500',
  },
  other: {
    label: 'Other',
    badge:
      'bg-slate-500/10 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400 border border-slate-500/20',
    swatch: 'bg-slate-500',
  },
};

interface TimetableTypeMeta {
  label: string;
  badge: string;
}

export const TIMETABLE_TYPE_META: Record<TimetableSlot['type'], TimetableTypeMeta> = {
  class: {
    label: 'Class',
    badge:
      'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 border border-indigo-500/20',
  },
  lab: {
    label: 'Lab',
    badge:
      'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20',
  },
  study: {
    label: 'Study',
    badge:
      'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400 border border-cyan-500/20',
  },
  break: {
    label: 'Break',
    badge:
      'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-500/20',
  },
};

export const DAYS_OF_WEEK: { id: DayOfWeek; label: string; short: string }[] = [
  { id: 'mon', label: 'Monday', short: 'MON' },
  { id: 'tue', label: 'Tuesday', short: 'TUE' },
  { id: 'wed', label: 'Wednesday', short: 'WED' },
  { id: 'thu', label: 'Thursday', short: 'THU' },
  { id: 'fri', label: 'Friday', short: 'FRI' },
  { id: 'sat', label: 'Saturday', short: 'SAT' },
  { id: 'sun', label: 'Sunday', short: 'SUN' },
];

export const EVENT_CATEGORIES: CalendarEvent['category'][] = [
  'work',
  'personal',
  'meeting',
  'study',
  'holiday',
  'other',
];

export const TIMETABLE_TYPES: TimetableSlot['type'][] = ['class', 'lab', 'study', 'break'];