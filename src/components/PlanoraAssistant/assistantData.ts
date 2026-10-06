import { ViewTab } from '../../types';

/* ------------------------------------------------------------------ */
/*  Planora — Contextual Assistant Content                             */
/*  Single source of truth for every message the bot can show.         */
/* ------------------------------------------------------------------ */

export interface PlanoraContextMessage {
  /** Emoji rendered as a soft accent chip inside the panel */
  emoji: string;
  /** Short version shown in the automatic speech bubble */
  intro: string;
  /** Full explanation shown inside the panel */
  message: string;
  /** Optional extra tip revealed by "Tell me more" */
  tip?: string;
}

export const planoraTabMessages: Record<ViewTab, PlanoraContextMessage> = {
  home: {
    emoji: '👋',
    intro: 'Welcome to Planora! This is your productivity dashboard.',
    message:
      'Welcome to Planora! This is your productivity dashboard. You can get a quick overview of your tasks, schedule, progress and important activities from here.',
    tip: 'Tip: Press Ctrl/⌘ + K to open the command palette and jump anywhere.',
  },
  todo: {
    emoji: '📝',
    intro: 'Here you can create and manage your tasks.',
    message:
      'Here you can create and manage your tasks. Add a task, set its priority and deadline, mark it as completed, favorite important tasks, or archive tasks you no longer need.',
    tip: 'Tip: Keep your most important tasks at high priority.',
  },
  tracker: {
    emoji: '📊',
    intro: 'This is your task tracker.',
    message:
      "This is your task tracker. Move tasks through different stages to understand what you're working on, what's in progress, and what you've completed.",
    tip: 'Drag tasks between columns to update their progress.',
  },
  calendar: {
    emoji: '📅',
    intro: 'This is your calendar.',
    message:
      "This is your calendar. Create and manage events, deadlines and important dates so you always know what's coming next.",
    tip: 'Tip: Set a reminder when creating an event so you never miss an important date.',
  },
  timetable: {
    emoji: '🕐',
    intro: 'This is your timetable.',
    message:
      'This is your timetable. Add your classes, activities or recurring schedule so you can keep your week organized in one place.',
    tip: 'Tip: Use class, study, lab and break slots to map out your full week.',
  },
  notes: {
    emoji: '📝',
    intro: 'Use Notes to capture ideas.',
    message:
      'Use Notes to capture ideas, study material, reminders and important information. You can organize your notes and quickly access the ones you need.',
    tip: 'Tip: Star important notes and they will show up under Favorites.',
  },
  favorites: {
    emoji: '⭐',
    intro: 'This section collects your favorites.',
    message:
      "This section collects the tasks or notes you've marked as favorites so you can quickly access the things that matter most.",
    tip: 'Tip: Click the star on any task or note to add it here.',
  },
  archive: {
    emoji: '🗄️',
    intro: 'Your archive keeps completed items.',
    message:
      'Your archive keeps completed or no-longer-active items without permanently deleting them. You can use it to keep your workspace clean.',
    tip: 'Tip: Restore an item anytime and it will return to its original section.',
  },
  settings: {
    emoji: '⚙️',
    intro: 'This is your settings area.',
    message:
      'This is your settings area. Manage your Planora preferences, appearance, profile and other application options from here.',
    tip: 'Tip: Try a different accent color — the whole app, including me, will match it.',
  },
};

/** Shown for special overlays that temporarily change the context */
export const planoraSpecialMessages: Record<'commandPalette' | 'quickAdd', PlanoraContextMessage> = {
  commandPalette: {
    emoji: '🔎',
    intro: 'This is the command palette.',
    message:
      'Use the command palette to quickly find features and navigate around Planora without searching through the entire dashboard.',
    tip: 'Tip: Type to search tasks, notes and events, or jump straight to any section.',
  },
  quickAdd: {
    emoji: '⚡',
    intro: 'Quick task creation.',
    message: 'Quickly create a task here without leaving your current page.',
    tip: 'Tip: Add a priority and deadline so it shows up on your dashboard right away.',
  },
};

/** Safe fallback — never throw on an unknown context */
export const planoraFallbackMessage: PlanoraContextMessage = {
  emoji: '👋',
  intro: "I'm Planora. Explore the workspace and I'll help you understand each section.",
  message: "I'm Planora. Explore the workspace and I'll help you understand each section.",
};

/** First-run onboarding sequence (speech bubble) */
export const planoraOnboardingMessages = [
  "👋 Hi! I'm Planora. I'll guide you around the workspace.",
  'Move between sections and I\'ll explain what each area does.',
];

export const PLANORA_INTRO_KEY = 'planora_intro_seen';

/** Marks that the one-time concierge welcome has been shown */
export const PLANORA_PANEL_WELCOME_KEY = 'planora_panel_welcome_seen';
