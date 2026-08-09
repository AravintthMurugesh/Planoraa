import { Task, CalendarEvent, TimetableSlot, Note, ActivityItem, UserProfile, UserSettings } from '../types';

export const initialProfile: UserProfile = {
  name: 'Alex Morgan',
  email: 'alex.morgan@company.io',
  role: 'Product Designer & Developer',
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

const getTodayFormatted = (offsetDays = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Review System Architecture & API Endpoints',
    description: 'Go over GraphQL schemas and ensure authentication middleware is properly configured for all user routes.',
    dueDate: getTodayFormatted(0),
    dueTime: '14:00',
    priority: 'high',
    status: 'in_progress',
    category: 'Engineering',
    tags: ['Architecture', 'Security', 'V2'],
    attachments: [
      { name: 'API_Spec_v2.pdf', url: '#', size: '2.4 MB' },
    ],
    notes: 'Need to sync with devops team prior to deployment.',
    subtasks: [
      { id: 'sub-1', title: 'Audit JWT token validation', completed: true },
      { id: 'sub-2', title: 'Review rate limiting configuration', completed: true },
      { id: 'sub-3', title: 'Update OpenAPI swagger documentation', completed: false },
    ],
    isFavorite: true,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Design Dark Mode Design System Tokens',
    description: 'Establish high contrast gray scales, surface elevation colors, and primary brand accents for the upcoming app release.',
    dueDate: getTodayFormatted(0),
    dueTime: '16:30',
    priority: 'high',
    status: 'todo',
    category: 'Design',
    tags: ['UI/UX', 'Figma', 'System'],
    subtasks: [
      { id: 'sub-4', title: 'Export color palette variables', completed: false },
      { id: 'sub-5', title: 'Test WCAG AAA contrast accessibility', completed: false },
    ],
    isFavorite: true,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Sprint Planning & Backlog Grooming',
    description: 'Prioritize upcoming feature requests with product managers and assign story points to tickets.',
    dueDate: getTodayFormatted(1),
    dueTime: '10:00',
    priority: 'medium',
    status: 'review',
    category: 'Management',
    tags: ['Agile', 'Sprint'],
    isFavorite: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Optimize Database Query Performance',
    description: 'Add composite indexes on active query joins to reduce P99 query latency under 50ms.',
    dueDate: getTodayFormatted(-1),
    dueTime: '11:00',
    priority: 'high',
    status: 'completed',
    category: 'Engineering',
    tags: ['Database', 'Performance'],
    completedAt: new Date().toISOString(),
    isFavorite: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Draft Monthly Product Update Newsletter',
    description: 'Write copy highlighting new feature rollouts, bug fixes, and community contributions.',
    dueDate: getTodayFormatted(3),
    dueTime: '17:00',
    priority: 'low',
    status: 'todo',
    category: 'Marketing',
    tags: ['Newsletter', 'Copywriting'],
    isFavorite: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'task-6',
    title: 'Conduct User Interview Sessions',
    description: 'Interview 4 beta testers regarding navigation flow usability and collect feedback.',
    dueDate: getTodayFormatted(2),
    dueTime: '15:00',
    priority: 'medium',
    status: 'in_progress',
    category: 'Research',
    tags: ['UserTesting', 'Feedback'],
    isFavorite: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'task-7',
    title: 'Setup Automated CI/CD E2E Testing Pipeline',
    description: 'Configure Playwright test runner in GitHub actions to execute on pull requests.',
    dueDate: getTodayFormatted(-2),
    dueTime: '18:00',
    priority: 'medium',
    status: 'completed',
    category: 'DevOps',
    tags: ['CI/CD', 'Playwright'],
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    isFavorite: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

export const initialEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Product Strategy Sync',
    date: getTodayFormatted(0),
    startTime: '10:00',
    endTime: '11:00',
    category: 'meeting',
    color: '#4F46E5',
    description: 'Align on Q3 product roadmap targets and key performance indicators.',
    isMeeting: true,
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    location: 'Conference Room Alpha / Virtual',
    reminderMinutes: 15,
  },
  {
    id: 'event-2',
    title: 'Design Critique Session',
    date: getTodayFormatted(0),
    startTime: '14:30',
    endTime: '15:30',
    category: 'work',
    color: '#8B5CF6',
    description: 'Review interactive prototypes for mobile app navigation overhaul.',
    isMeeting: true,
    meetingLink: 'https://meet.google.com/xyz-1234-567',
    location: 'Design Studio B',
    reminderMinutes: 10,
  },
  {
    id: 'event-3',
    title: 'Team Weekly Retrospective',
    date: getTodayFormatted(1),
    startTime: '16:00',
    endTime: '17:00',
    category: 'meeting',
    color: '#0EA5E9',
    description: 'Discuss sprint highlights, obstacles, and process improvement points.',
    isMeeting: true,
  },
  {
    id: 'event-4',
    title: 'Deep Focus Work - Frontend Refactoring',
    date: getTodayFormatted(2),
    startTime: '09:00',
    endTime: '12:00',
    category: 'study',
    color: '#10B981',
    description: 'Block off time without notifications to refactor state management store.',
  },
  {
    id: 'event-5',
    title: 'Quarterly Innovation Day',
    date: getTodayFormatted(5),
    startTime: '09:00',
    endTime: '17:00',
    category: 'holiday',
    color: '#F59E0B',
    description: 'Company-wide hackathon and experimentation day!',
  },
];

export const initialTimetableSlots: TimetableSlot[] = [
  {
    id: 'tt-1',
    day: 'mon',
    startTime: '09:00',
    endTime: '10:30',
    subject: 'Advanced System Architecture',
    room: 'Hall 402',
    teacher: 'Dr. Sarah Jenkins',
    color: '#4F46E5',
    type: 'class',
  },
  {
    id: 'tt-2',
    day: 'mon',
    startTime: '10:45',
    endTime: '12:15',
    subject: 'UI/UX Design Systems',
    room: 'Studio 101',
    teacher: 'Prof. Marcus Vance',
    color: '#8B5CF6',
    type: 'class',
  },
  {
    id: 'tt-3',
    day: 'mon',
    startTime: '12:15',
    endTime: '13:15',
    subject: 'Lunch & Networking Break',
    room: 'Cafeteria Lounge',
    teacher: 'N/A',
    color: '#64748B',
    type: 'break',
  },
  {
    id: 'tt-4',
    day: 'mon',
    startTime: '13:30',
    endTime: '15:30',
    subject: 'Algorithms & Complexity Lab',
    room: 'Lab 3B',
    teacher: 'Dr. Alan Turing',
    color: '#0EA5E9',
    type: 'lab',
  },
  {
    id: 'tt-5',
    day: 'tue',
    startTime: '09:00',
    endTime: '11:00',
    subject: 'Machine Learning Fundamentals',
    room: 'Hall 201',
    teacher: 'Dr. Elena Rostova',
    color: '#10B981',
    type: 'class',
  },
  {
    id: 'tt-6',
    day: 'tue',
    startTime: '11:15',
    endTime: '12:45',
    subject: 'Product Management Strategy',
    room: 'Seminar Room 5',
    teacher: 'David Sterling',
    color: '#F59E0B',
    type: 'class',
  },
  {
    id: 'tt-7',
    day: 'wed',
    startTime: '09:00',
    endTime: '12:00',
    subject: 'Independent Code & Research Focus',
    room: 'Library Quiet Zone',
    teacher: 'Self Study',
    color: '#6366F1',
    type: 'study',
  },
  {
    id: 'tt-8',
    day: 'thu',
    startTime: '10:00',
    endTime: '12:00',
    subject: 'Cloud Computing Infrastructure',
    room: 'Hall 305',
    teacher: 'Dr. Kenneth Ray',
    color: '#06B6D4',
    type: 'class',
  },
  {
    id: 'tt-9',
    day: 'fri',
    startTime: '14:00',
    endTime: '16:00',
    subject: 'Capstone Project Review',
    room: 'Auditorium A',
    teacher: 'Panel Committee',
    color: '#EC4899',
    type: 'class',
  },
];

export const initialNotes: Note[] = [
  {
    id: 'note-1',
    title: '🚀 Q3 Product Engineering Strategy',
    category: 'Work',
    tags: ['Roadmap', 'Architecture', 'Strategy'],
    isFavorite: true,
    isArchived: false,
    coverColor: 'from-indigo-500/10 to-purple-500/10',
    icon: '🚀',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    blocks: [
      {
        id: 'nb-1',
        type: 'heading1',
        content: 'Executive Summary',
      },
      {
        id: 'nb-2',
        type: 'paragraph',
        content: 'Our core objective for Q3 is delivering real-time collaboration features while optimizing page render times down under 100ms globally.',
      },
      {
        id: 'nb-3',
        type: 'callout',
        content: 'Focus Area: Minimal latency state synchronization, client-first caching, and effortless UI micro-interactions.',
      },
      {
        id: 'nb-4',
        type: 'heading2',
        content: 'Key Technical Milestones',
      },
      {
        id: 'nb-5',
        type: 'checklist',
        content: 'Migrate core state stores to optimized persistent context',
        checked: true,
      },
      {
        id: 'nb-6',
        type: 'checklist',
        content: 'Implement Notion-style block editor with instant auto-save',
        checked: true,
      },
      {
        id: 'nb-7',
        type: 'checklist',
        content: 'Integrate full Keyboard Command Palette (Cmd + K) shortcuts',
        checked: false,
      },
      {
        id: 'nb-8',
        type: 'code',
        language: 'typescript',
        content: `// Example optimized cache lookup helper
export function getCachedItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}`,
      },
      {
        id: 'nb-9',
        type: 'quote',
        content: '"Simplicity is about subtracting the obvious and adding the meaningful." — John Maeda',
      },
    ],
  },
  {
    id: 'note-2',
    title: '🎨 Design Systems & Typography Rules',
    category: 'Design',
    tags: ['UI', 'Tokens', 'Guide'],
    isFavorite: false,
    isArchived: false,
    coverColor: 'from-blue-500/10 to-teal-500/10',
    icon: '🎨',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    blocks: [
      {
        id: 'nb-10',
        type: 'heading1',
        content: 'Typography & Layout Principles',
      },
      {
        id: 'nb-11',
        type: 'paragraph',
        content: 'Use Inter or SF Pro Display with generous whitespace. Cards should feature 18px-24px rounded corners with soft elevation drop shadows.',
      },
      {
        id: 'nb-12',
        type: 'bullet',
        content: 'Primary Color: #4F46E5 (Indigo)',
      },
      {
        id: 'nb-13',
        type: 'bullet',
        content: 'Background Canvas: #F8FAFC / Dark #0B0F17',
      },
      {
        id: 'nb-14',
        type: 'bullet',
        content: 'Card Borders: Subtle 1px translucent borders with glassmorphism backdrop blur',
      },
    ],
  },
  {
    id: 'note-3',
    title: '💡 Daily Productivity & Morning Routine',
    category: 'Personal',
    tags: ['Habits', 'Focus'],
    isFavorite: true,
    isArchived: false,
    coverColor: 'from-amber-500/10 to-rose-500/10',
    icon: '⚡',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    blocks: [
      {
        id: 'nb-15',
        type: 'heading1',
        content: 'The 3-3-3 Rule for Maximum Focus',
      },
      {
        id: 'nb-16',
        type: 'number',
        content: 'Spend 3 hours on your #1 deep work task without notifications.',
      },
      {
        id: 'nb-17',
        type: 'number',
        content: 'Complete 3 shorter urgent tasks (emails, reviews, pull requests).',
      },
      {
        id: 'nb-18',
        type: 'number',
        content: 'Perform 3 maintenance/organizing activities (planning, clean desk, notes).',
      },
    ],
  }
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Completed task "Optimize Database Query Performance"',
    type: 'task_completed',
    timestamp: '2 hours ago',
    meta: 'Engineering',
  },
  {
    id: 'act-2',
    title: 'Created new event "Design Critique Session"',
    type: 'event_added',
    timestamp: '4 hours ago',
    meta: 'Today at 14:30',
  },
  {
    id: 'act-3',
    title: 'Updated note "🚀 Q3 Product Engineering Strategy"',
    type: 'note_created',
    timestamp: '5 hours ago',
    meta: 'Added technical milestones',
  },
  {
    id: 'act-4',
    title: 'Added task "Review System Architecture & API Endpoints"',
    type: 'task_created',
    timestamp: 'Yesterday',
    meta: 'High Priority',
  }
];

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
