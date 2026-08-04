export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  priority: Priority;
  status: TaskStatus;
  category: string;
  tags: string[];
  attachments?: { name: string; url: string; size?: string }[];
  notes?: string;
  subtasks?: Subtask[];
  isFavorite?: boolean;
  isArchived?: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  category: 'work' | 'personal' | 'meeting' | 'study' | 'holiday' | 'other';
  color: string;
  description?: string;
  isMeeting?: boolean;
  meetingLink?: string;
  location?: string;
  reminderMinutes?: number;
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  startTime: string; // HH:MM e.g. "09:00"
  endTime: string; // HH:MM e.g. "10:30"
  subject: string;
  room: string;
  teacher: string;
  color: string;
  type: 'class' | 'break' | 'study' | 'lab';
}

export interface NoteBlock {
  id: string;
  type: 'heading1' | 'heading2' | 'paragraph' | 'checklist' | 'bullet' | 'number' | 'code' | 'quote' | 'callout' | 'table';
  content: string;
  checked?: boolean; // for checklist
  language?: string; // for code block
  tableData?: string[][]; // for table block [row][col]
}

export interface Note {
  id: string;
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

export interface ActivityItem {
  id: string;
  title: string;
  type: 'task_completed' | 'task_created' | 'note_created' | 'event_added' | 'timetable_updated';
  timestamp: string;
  meta?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'indigo' | 'violet' | 'emerald' | 'rose' | 'amber' | 'slate';

export interface UserSettings {
  theme: ThemeMode;
  accentColor: AccentColor;
  fontFamily: 'sans' | 'mono' | 'serif';
  notifications: {
    taskReminders: boolean;
    calendarAlerts: boolean;
    dailyDigest: boolean;
    soundEnabled: boolean;
  };
  language: string;
}

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

export interface ToastMessage {
  id: string;
  title: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
