import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../supabase';
import {
  Task,
  CalendarEvent,
  TimetableSlot,
  Note,
  ActivityItem,
  UserProfile,
  UserSettings,
  ViewTab,
  ToastMessage,
  TaskStatus,
  Priority,
  NoteBlock,
} from '../types';
import {
  initialTasks,
  initialEvents,
  initialTimetableSlots,
  initialNotes,
  initialActivities,
  initialProfile,
  initialSettings,
} from '../data/initialData';

const OAUTH_URL_PARAMS = [
  'access_token',
  'expires_in',
  'expires_at',
  'refresh_token',
  'token_type',
  'provider_token',
  'provider_refresh_token',
  'code',
  'state',
  'error',
  'error_description',
  'error_code',
];

const cleanupOAuthUrl = () => {
  try {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.hash.replace(/^#/, ''));
    let changed = false;
    for (const key of OAUTH_URL_PARAMS) {
      if (params.has(key)) {
        params.delete(key);
        changed = true;
      }
    }
    if (changed) {
      const rest = params.toString();
      url.hash = rest ? `#${rest}` : '';
      window.history.replaceState(null, '', url.toString());
    }
  } catch {
    // URL cleanup must never break the auth flow
  }
};

interface AppContextType {
  // Navigation
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  toggleTaskFavorite: (id: string) => void;
  toggleTaskArchive: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;

  // Events
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // Timetable
  timetable: TimetableSlot[];
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  updateTimetableSlot: (id: string, updates: Partial<TimetableSlot>) => void;
  deleteTimetableSlot: (id: string) => void;

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleNoteFavorite: (id: string) => void;
  toggleNoteArchive: (id: string) => void;
  updateNoteBlocks: (noteId: string, blocks: NoteBlock[]) => void;

  // Activity Log
  activities: ActivityItem[];

  // Auth State
  isAuthenticated: boolean;
  authLoading: boolean;
  supabaseUser: User | null;
  oauthSigninError: string | null;
  clearOauthSigninError: () => void;
  login: (email?: string, name?: string) => void;
  logout: () => void;
  signupWithSupabase: (email: string, pass: string, fullName: string) => Promise<{ data: any; error: any }>;
  loginWithSupabase: (email: string, pass: string) => Promise<{ data: any; error: any }>;
  loginWithGoogleSupabase: () => Promise<{ data: any; error: any }>;
  logoutWithSupabase: () => Promise<void>;
  resetPasswordWithSupabase: (email: string) => Promise<{ data: any; error: any }>;

  // Profile & Settings
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  clearWorkspaceData: () => void;

  // Search & Modals
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isQuickTaskModalOpen: boolean;
  setQuickTaskModalOpen: (open: boolean) => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (title: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Helper selectors
  activeTasks: Task[];
  completedTasks: Task[];
  todayTasks: Task[];
  upcomingTasks: Task[];
  overdueTasks: Task[];
  highPriorityTasks: Task[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or defaults
  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isQuickTaskModalOpen, setQuickTaskModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('mytasks_items');
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('mytasks_events');
      return saved ? JSON.parse(saved) : initialEvents;
    } catch {
      return initialEvents;
    }
  });

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    try {
      const saved = localStorage.getItem('mytasks_timetable');
      return saved ? JSON.parse(saved) : initialTimetableSlots;
    } catch {
      return initialTimetableSlots;
    }
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('mytasks_notes');
      return saved ? JSON.parse(saved) : initialNotes;
    } catch {
      return initialNotes;
    }
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem('mytasks_activities');
      return saved ? JSON.parse(saved) : initialActivities;
    } catch {
      return initialActivities;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('mytasks_profile');
      return saved ? JSON.parse(saved) : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('mytasks_settings');
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [oauthSigninError, setOauthSigninError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('planora_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Initialize and listen to Supabase Auth State
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        if (!isSupabaseConfigured()) {
          if (isMounted) setAuthLoading(false);
          return;
        }

        const redirectParams = new URLSearchParams(
          window.location.hash.slice(1) || window.location.search.slice(1)
        );
        const oauthError =
          redirectParams.get('error_description') ||
          redirectParams.get('error') ||
          redirectParams.get('error_code');
        if (oauthError && isMounted) {
          console.warn('Google OAuth callback error:', oauthError);
          setOauthSigninError(oauthError);
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase getSession error:', error);
        }

        if (session?.user) {
          if (isMounted) {
            setSupabaseUser(session.user);
            setIsAuthenticated(true);
            localStorage.setItem('planora_authenticated', 'true');
            const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
            const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
            const provider = session.user.app_metadata?.provider || 'google';

            setProfile((prev) => ({
              ...prev,
              email: session.user.email || prev.email,
              name: fullName || prev.name,
              avatar: avatarUrl || prev.avatar,
              avatarUrl: avatarUrl || prev.avatarUrl,
              provider: provider,
              createdAt: session.user.created_at,
              userId: session.user.id,
            }));

            if (isSupabaseConfigured()) {
              supabase
                .from('profiles')
                .upsert({
                  id: session.user.id,
                  full_name: fullName || session.user.email?.split('@')[0] || 'User',
                  email: session.user.email,
                  avatar_url: avatarUrl,
                  provider: provider,
                  created_at: session.user.created_at || new Date().toISOString(),
                }, { onConflict: 'id' })
                .then(({ error }) => {
                  if (error) {
                    console.debug('Profiles table note:', error.message);
                  }
                });
            }
          }
        }
      } catch (err) {
        console.warn('Supabase auth initialization error:', err);
      } finally {
        cleanupOAuthUrl();
        if (isMounted) setAuthLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        setIsAuthenticated(true);
        localStorage.setItem('planora_authenticated', 'true');
        const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
        const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
        const provider = session.user.app_metadata?.provider || 'google';

        setProfile((prev) => ({
          ...prev,
          email: session.user.email || prev.email,
          name: fullName || prev.name,
          avatar: avatarUrl || prev.avatar,
          avatarUrl: avatarUrl || prev.avatarUrl,
          provider: provider,
          createdAt: session.user.created_at,
          userId: session.user.id,
        }));

        if (_event === 'SIGNED_IN') {
          addToast(`Welcome to Planora, ${fullName || session.user.email?.split('@')[0] || 'User'}!`, 'success');
        }

        if (isSupabaseConfigured()) {
          supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              full_name: fullName || session.user.email?.split('@')[0] || 'User',
              email: session.user.email,
              avatar_url: avatarUrl,
              provider: provider,
              created_at: session.user.created_at || new Date().toISOString(),
            }, { onConflict: 'id' })
            .then(({ error }) => {
              if (error) {
                console.debug('Profiles table note:', error.message);
              }
            });
        }
      } else if (_event === 'SIGNED_OUT') {
        setSupabaseUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('planora_authenticated');
      }
      setAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const clearWorkspaceData = () => {
    setTasks([]);
    setEvents([]);
    setTimetable([]);
    setNotes([]);
    setActivities([]);
    try {
      localStorage.setItem('mytasks_items', JSON.stringify([]));
      localStorage.setItem('mytasks_events', JSON.stringify([]));
      localStorage.setItem('mytasks_timetable', JSON.stringify([]));
      localStorage.setItem('mytasks_notes', JSON.stringify([]));
      localStorage.setItem('mytasks_activities', JSON.stringify([]));
    } catch (e) {
      console.error('Failed to clear localStorage workspace data:', e);
    }
  };

  const signupWithSupabase = async (email: string, pass: string, fullName: string) => {
    clearWorkspaceData();
    if (!isSupabaseConfigured()) {
      login(email, fullName, true);
      return { data: { user: null, session: null }, error: null };
    }
    const res = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: fullName,
          name: fullName,
        },
      },
    });
    if (!res.error && res.data.session) {
      setIsAuthenticated(true);
      localStorage.setItem('planora_authenticated', 'true');
      setProfile((prev) => ({
        ...prev,
        email: email,
        name: fullName,
      }));
      addToast(`Account created! Welcome to your fresh Planora workspace, ${fullName}.`, 'success');
    }
    return res;
  };

  const loginWithSupabase = async (email: string, pass: string) => {
    if (!isSupabaseConfigured()) {
      login(email);
      return { data: { user: null, session: null }, error: null };
    }
    const res = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (!res.error && res.data.session) {
      setIsAuthenticated(true);
      localStorage.setItem('planora_authenticated', 'true');
      const userMeta = res.data.user?.user_metadata;
      const fullName = userMeta?.full_name || userMeta?.name;
      setProfile((prev) => ({
        ...prev,
        email: email,
        name: fullName || prev.name,
      }));
      addToast('Signed in successfully!', 'success');
    }
    return res;
  };

  const logoutWithSupabase = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    setSupabaseUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('planora_authenticated');
    addToast('You have been logged out.', 'info');
  };

  const resetPasswordWithSupabase = async (email: string) => {
    if (!isSupabaseConfigured()) {
      return { data: {}, error: null };
    }
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
  };

  const loginWithGoogleSupabase = async () => {
    if (!isSupabaseConfigured()) {
      login('alex.morgan@gmail.com', 'Alex Morgan');
      addToast('Signed in with Google!', 'success');
      return { data: { user: null, session: null }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (data?.url) {
        console.info('Google OAuth authorize URL (verify this points to your Supabase project):', data.url);
      }
      if (error) {
        addToast(`Google authentication failed: ${error.message}`, 'error');
      }
      return { data, error };
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      addToast('An error occurred during Google sign-in.', 'error');
      return { data: null, error: err };
    }
  };

  const login = (email?: string, name?: string, isNewSignUp: boolean = false) => {
    if (isNewSignUp) {
      clearWorkspaceData();
    }
    setIsAuthenticated(true);
    localStorage.setItem('planora_authenticated', 'true');
    if (email || name) {
      setProfile((prev) => ({
        ...prev,
        email: email || prev.email,
        name: name || prev.name,
      }));
    }
    addToast(`Welcome to Planora, ${name || profile.name}!`, 'success');
  };

  const logout = () => {
    logoutWithSupabase();
  };

  const clearOauthSigninError = () => {
    setOauthSigninError(null);
  };

  // LocalStorage Auto-Save
  useEffect(() => {
    try {
      localStorage.setItem('mytasks_items', JSON.stringify(tasks));
    } catch (e) { console.error(e); }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('mytasks_events', JSON.stringify(events));
    } catch (e) { console.error(e); }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('mytasks_timetable', JSON.stringify(timetable));
    } catch (e) { console.error(e); }
  }, [timetable]);

  useEffect(() => {
    try {
      localStorage.setItem('mytasks_notes', JSON.stringify(notes));
    } catch (e) { console.error(e); }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem('mytasks_activities', JSON.stringify(activities));
    } catch (e) { console.error(e); }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem('mytasks_profile', JSON.stringify(profile));
    } catch (e) { console.error(e); }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('mytasks_settings', JSON.stringify(settings));
    } catch (e) { console.error(e); }
  }, [settings]);

  // Apply Theme (Dark/Light/System)
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const applyTheme = () => {
      const isDark =
        settings.theme === 'dark' ||
        (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        root.classList.add('dark');
        body.classList.add('dark');
      } else {
        root.classList.remove('dark');
        body.classList.remove('dark');
      }
    };

    applyTheme();

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.theme]);

  // Toast System
  const addToast = (title: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Activity logger helper
  const logActivity = (title: string, type: ActivityItem['type'], meta?: string) => {
    const newItem: ActivityItem = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      type,
      timestamp: 'Just now',
      meta,
    };
    setActivities((prev) => [newItem, ...prev.slice(0, 19)]);
  };

  // Task Actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    addToast(`Task "${newTask.title}" created`, 'success');
    logActivity(`Created task "${newTask.title}"`, 'task_created', newTask.category);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    addToast('Task updated', 'info');
  };

  const deleteTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (target) {
      addToast(`Task "${target.title}" deleted`, 'warning');
    }
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
          const completedAt = nextStatus === 'completed' ? new Date().toISOString() : undefined;
          if (nextStatus === 'completed') {
            addToast(`Completed: ${t.title}`, 'success');
            logActivity(`Completed task "${t.title}"`, 'task_completed', t.category);
          }
          return { ...t, status: nextStatus, completedAt };
        }
        return t;
      })
    );
  };

  const toggleTaskFavorite = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isFav = !t.isFavorite;
          addToast(isFav ? 'Added to favorites' : 'Removed from favorites', 'info');
          return { ...t, isFavorite: isFav };
        }
        return t;
      })
    );
  };

  const toggleTaskArchive = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isArch = !t.isArchived;
          addToast(isArch ? 'Task archived' : 'Task restored', 'info');
          return { ...t, isArchived: isArch };
        }
        return t;
      })
    );
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const completedAt = status === 'completed' ? new Date().toISOString() : undefined;
          return { ...t, status, completedAt };
        }
        return t;
      })
    );
  };

  // Event Actions
  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: 'event-' + Math.random().toString(36).substring(2, 9),
    };
    setEvents((prev) => [...prev, newEvent]);
    addToast(`Event "${newEvent.title}" added to calendar`, 'success');
    logActivity(`Added event "${newEvent.title}"`, 'event_added', newEvent.date);
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    addToast('Event updated', 'info');
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    addToast('Event removed', 'warning');
  };

  // Timetable Actions
  const addTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slotData,
      id: 'tt-' + Math.random().toString(36).substring(2, 9),
    };
    setTimetable((prev) => [...prev, newSlot]);
    addToast(`Added "${newSlot.subject}" to timetable`, 'success');
    logActivity(`Added timetable slot "${newSlot.subject}"`, 'timetable_updated', newSlot.day.toUpperCase());
  };

  const updateTimetableSlot = (id: string, updates: Partial<TimetableSlot>) => {
    setTimetable((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    addToast('Timetable updated', 'info');
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetable((prev) => prev.filter((s) => s.id !== id));
    addToast('Slot removed from timetable', 'warning');
  };

  // Note Actions
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...noteData,
      id: 'note-' + Math.random().toString(36).substring(2, 9),
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    addToast(`Note "${newNote.title}" created`, 'success');
    logActivity(`Created note "${newNote.title}"`, 'note_created', newNote.category);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    addToast('Note deleted', 'warning');
  };

  const toggleNoteFavorite = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
    );
    addToast('Note favorite toggled', 'info');
  };

  const toggleNoteArchive = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isArchived: !n.isArchived } : n))
    );
    addToast('Note archive updated', 'info');
  };

  const updateNoteBlocks = (noteId: string, blocks: NoteBlock[]) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, blocks, updatedAt: new Date().toISOString() } : n))
    );
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    addToast('Settings saved', 'info');
  };

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter Selectors
  const activeTasks = tasks.filter((t) => !t.isArchived);
  const completedTasks = activeTasks.filter((t) => t.status === 'completed');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = activeTasks.filter((t) => t.dueDate === todayStr);
  const upcomingTasks = activeTasks.filter((t) => t.dueDate > todayStr && t.status !== 'completed');
  const overdueTasks = activeTasks.filter((t) => t.dueDate < todayStr && t.status !== 'completed');
  const highPriorityTasks = activeTasks.filter((t) => t.priority === 'high' && t.status !== 'completed');

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        toggleTaskFavorite,
        toggleTaskArchive,
        updateTaskStatus,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        timetable,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
        notes,
        addNote,
        updateNote,
        deleteNote,
        toggleNoteFavorite,
        toggleNoteArchive,
        updateNoteBlocks,
        activities,
        isAuthenticated,
        authLoading,
        supabaseUser,
        oauthSigninError,
        clearOauthSigninError,
        login,
        logout,
        signupWithSupabase,
        loginWithSupabase,
        loginWithGoogleSupabase,
        logoutWithSupabase,
        resetPasswordWithSupabase,
        profile,
        setProfile,
        settings,
        updateSettings,
        clearWorkspaceData,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        isQuickTaskModalOpen,
        setQuickTaskModalOpen,
        toasts,
        addToast,
        removeToast,
        activeTasks,
        completedTasks,
        todayTasks,
        upcomingTasks,
        overdueTasks,
        highPriorityTasks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
