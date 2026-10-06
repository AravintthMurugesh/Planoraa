import { Task, CalendarEvent, TimetableSlot, Note, ActivityItem, UserProfile, UserSettings } from '../types';

export const initialProfile: UserProfile = {
  name: '',
  email: '',
  role: '',
};

export const initialSettings: UserSettings = {
  theme: 'light',
  accentColor: 'indigo',
  fontFamily: 'sans',
  notifications: {
    taskReminders: true,
    calendarAlerts: true,
    dailyDigest: false,
    soundEnabled: true,
  },
  language: 'English (US)',
};

export const initialTasks: Task[] = [];

export const initialEvents: CalendarEvent[] = [];

export const initialTimetableSlots: TimetableSlot[] = [];

export const initialNotes: Note[] = [];

export const initialActivities: ActivityItem[] = [];

export const productivityQuotes = [
  {
    quote: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
    author: "Paul J. Meyer"
  },
  {
    quote: "Focus on being productive instead of busy.",
    author: "Tim Ferriss"
  },
  {
    quote: "Your mind is for having ideas, not holding them.",
    author: "David Allen"
  },
  {
    quote: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey"
  },
  {
    quote: "Action is the foundational key to all success.",
    author: "Pablo Picasso"
  }
];
