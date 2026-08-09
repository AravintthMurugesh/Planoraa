/* ------------------------------------------------------------------ */
/*  Planora — Core Domain Types                                       */
/* ------------------------------------------------------------------ */

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type ViewTab =
  | 'home'
  | 'todo'
  | 'tracker'
  | 'calendar'
  | 'timetable'
  | 'notes'
  | 'favorites'
  | 'archive'
  | 'settings';
export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'indigo' | 'violet' | 'emerald' | 'rose' | 'amber' | 'slate';
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

interface BaseEntity {
  id: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  name: string;
  url: string;
  size?: string;
}

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  /** YYYY-MM-DD */
  dueDate: string;
  /** HH:MM */
  dueTime?: string;
  priority: Priority;
  status: TaskStatus;
  category: string;
  tags: string[];
  attachments?: Attachment[];
  notes?: string;
  subtasks?: Subtask[];
  isFavorite?: boolean;
  isArchived?: boolean;
  createdAt: string;
  completedAt?: string;
}

export type CalendarEventCategory = 'work' | 'personal' | 'meeting' | 'study' | 'holiday' | 'other';

export interface CalendarEvent extends BaseEntity {
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM */
  startTime: string;
  /** HH:MM */
  endTime: string;
  category: CalendarEventCategory;
  color: string;
  description?: string;
  isMeeting?: boolean;
  meetingLink?: string;
  location?: string;
  reminderMinutes?: number;
}

export interface TimetableSlot extends BaseEntity {
  day: DayOfWeek;
  /** HH:MM e.g. "09:00" */
  startTime: string;
  /** HH:MM e.g. "10:30" */
  endTime: string;
  subject: string;
  room: string;
  teacher: string;
  color: string;
  type: 'class' | 'break' | 'study' | 'lab';
}

export type NoteBlockType =
  | 'heading1'
  | 'heading2'
  | 'paragraph'
  | 'checklist'
  | 'bullet'
  | 'number'
  | 'code'
  | 'quote'
  | 'callout'
  | 'table';

export interface NoteBlock extends BaseEntity {
  type: NoteBlockType;
  content: string;
  /** checklist blocks */
  checked?: boolean;
  /** code blocks */
  language?: string;
  /** table blocks — [row][col] */
  tableData?: string[][];
}

export interface Note extends BaseEntity {
  title: string;
  blocks: NoteBlock[];
  category: string;
  tags: string[];
  isFavorite?: boolean;
  isArchived?: boolean;
  coverColor?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType =
  | 'task_completed'
  | 'task_created'
  | 'note_created'
  | 'event_added'
  | 'timetable_updated';

export interface ActivityItem extends BaseEntity {
  title: string;
  type: ActivityType;
  timestamp: string;
  meta?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  provider?: string;
  createdAt?: string;
  userId?: string;
}

export interface NotificationSettings {
  taskReminders: boolean;
  calendarAlerts: boolean;
  dailyDigest: boolean;
  soundEnabled: boolean;
}

export interface UserSettings {
  theme: ThemeMode;
  accentColor: AccentColor;
  fontFamily: 'sans' | 'mono' | 'serif';
  notifications: NotificationSettings;
  language: string;
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage extends BaseEntity {
  title: string;
  type?: ToastType;
}