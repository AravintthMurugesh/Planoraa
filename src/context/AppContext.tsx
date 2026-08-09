import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../supabase';
import { uid, todayISO } from '../lib/utils';
import { readStorage, writeStorage, removeStorage } from '../lib/storage';
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
  NoteBlock,
  ActivityType,
  ToastType,
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

const STORAGE_KEYS = {
  tasks: 'mytasks_items',
  events: 'mytasks_events',
  timetable: 'mytasks_timetable',
  notes: 'mytasks_notes',
  activities: 'mytasks_activities',
  profile: 'mytasks_profile',
  settings: 'mytasks_settings',
  authenticated: 'planora_authenticated',
} as const;

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

const hashPin = (pin: string): string => {
  let h = 5381;
  for (let i = 0; i < pin.length; i++) {
    h = ((h << 5) + h + pin.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
};

interface AuthResult {
  data: { session?: Session | null } | null;
  error: { message: string } | null;
}

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

  // Vault PIN
  hasVaultPin: boolean;
  isVaultUnlocked: boolean;
  setVaultPin: (pin: string) => void;
  unlockVault: (pin: string) => boolean;
  lockVault: () => void;
  resetVaultPin: () => void;

  // Activity Log
  activities: ActivityItem[];

  // Auth State
  isAuthenticated: boolean;
  authLoading: boolean;
  supabaseUser: User | null;
  oauthSigninError: string | null;
  clearOauthSigninError: () => void;
  login: (email?: string, name?: string, isNewSignUp?: boolean) => void;
  logout: () => void;
  signupWithSupabase: (email: string, pass: string, fullName: string) => Promise<AuthResult>;
  loginWithSupabase: (email: string, pass: string) => Promise<AuthResult>;
  loginWithGoogleSupabase: () => Promise<AuthResult>;
  logoutWithSupabase: () => Promise<void>;
  resetPasswordWithSupabase: (email: string) => Promise<{ error: { message: string } | null }>;

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
  addToast: (title: string, type?: ToastType) => void;
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
  // ---------------- Navigation & Global UI State ----------------
  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isQuickTaskModalOpen, setQuickTaskModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // ---------------- Persistent Workspace Data ----------------
  const [tasks, setTasks] = useState<Task[]>(() => readStorage<Task[]>(STORAGE_KEYS.tasks, initialTasks));
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    readStorage<CalendarEvent[]>(STORAGE_KEYS.events, initialEvents)
  );
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() =>
    readStorage<TimetableSlot[]>(STORAGE_KEYS.timetable, initialTimetableSlots)
  );
  const [notes, setNotes] = useState<Note[]>(() => readStorage<Note[]>(STORAGE_KEYS.notes, initialNotes));
  const [activities, setActivities] = useState<ActivityItem[]>(() =>
    readStorage<ActivityItem[]>(STORAGE_KEYS.activities, initialActivities)
  );
  const [profile, setProfile] = useState<UserProfile>(() =>
    readStorage<UserProfile>(STORAGE_KEYS.profile, initialProfile)
  );
  const [settings, setSettings] = useState<UserSettings>(() =>
    readStorage<UserSettings>(STORAGE_KEYS.settings, initialSettings)
  );

  const readRaw = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeRaw = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // best-effort
  }
};

// ---------------- Vault PIN ----------------
  const vaultStorageKey = `planora_vault_pin_${profile.userId || 'local'}`;
  const [hasVaultPin, setHasVaultPin] = useState<boolean>(() => Boolean(readRaw(vaultStorageKey)));
  const [isVaultUnlocked, setIsVaultUnlocked] = useState<boolean>(false);

  // ---------------- Auth state ----------------
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.authenticated) === 'true';
    } catch {
      return false;
    }
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [oauthSigninError, setOauthSigninError] = useState<string | null>(null);

  // ---------------- Toast system ----------------
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (title: string, type: ToastType = 'success') => {
    const id = uid('toast');
    setToasts((prev) => [...prev, { id, title, type }]);
    window.setTimeout(() => removeToast(id), 4000);
  };

  // ---------------- Activity logger ----------------
  const logActivity = (title: string, type: ActivityType, meta?: string) => {
    const newItem: ActivityItem = { id: uid('act'), title, type, timestamp: 'Just now', meta };
    setActivities((prev) => [newItem, ...prev.slice(0, 19)]);
  };

  // ---------------- Profile sync helpers ----------------
  const syncProfileFromUser = (
    user: { email?: string | null; id?: string; user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown>; created_at?: string }
  ) => {
    const fullName = String(user.user_metadata?.full_name || user.user_metadata?.name || '') || undefined;
    const provider = String(user.app_metadata?.provider || 'google');
    setProfile((prev) => ({
      ...prev,
      email: user.email || prev.email,
      name: fullName || prev.name,
      provider,
      createdAt: user.created_at || prev.createdAt,
      userId: user.id,
    }));
    return { fullName: fullName || user.email?.split('@')[0] || 'User', provider };
  };

  const upsertProfileRecord = (
    userId: string,
    fullName: string,
    email?: string | null,
    provider?: string
  ) => {
    if (!isSupabaseConfigured()) return;
    supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          full_name: fullName,
          email,
          provider,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .then(({ error }) => {
        if (error) console.debug('Profiles table note:', error.message);
      });
  };

  // ---------------- Vault actions ----------------
  const setVaultPin = (pin: string) => {
    writeRaw(vaultStorageKey, hashPin(pin));
    setHasVaultPin(true);
    setIsVaultUnlocked(true);
    addToast('Vault protected with a 4-digit PIN.', 'success');
  };

  const unlockVault = (pin: string): boolean => {
    const stored = readRaw(vaultStorageKey);
    if (stored && stored === hashPin(pin)) {
      setIsVaultUnlocked(true);
      return true;
    }
    return false;
  };

  const lockVault = () => setIsVaultUnlocked(false);

  const resetVaultPin = () => {
    removeStorage(vaultStorageKey);
    setHasVaultPin(false);
    setIsVaultUnlocked(false);
    addToast('Vault PIN cleared. Archive is now unprotected.', 'info');
  };

  useEffect(() => {
    setHasVaultPin(Boolean(readRaw(vaultStorageKey)));
    setIsVaultUnlocked(false);
  }, [profile.userId]);

  // ---------------- Auth initialization ----------------
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

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase getSession error:', error);
        }

        if (session?.user && isMounted) {
          setSupabaseUser(session.user);
          setIsAuthenticated(true);
          writeStorage(STORAGE_KEYS.authenticated, true);
          const identity = syncProfileFromUser(session.user);
          upsertProfileRecord(session.user.id, identity.fullName, session.user.email, identity.provider);
        }
      } catch (err) {
        console.warn('Supabase auth initialization error:', err);
      } finally {
        cleanupOAuthUrl();
        if (isMounted) setAuthLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        setIsAuthenticated(true);
        writeStorage(STORAGE_KEYS.authenticated, true);
        const { fullName } = syncProfileFromUser(session.user);
        upsertProfileRecord(
          session.user.id,
          fullName,
          session.user.email,
          session.user.app_metadata?.provider as string | undefined
        );
        if (event === 'SIGNED_IN') {
          addToast(`Welcome to Planora, ${fullName}!`, 'success');
        }
      } else if (event === 'SIGNED_OUT') {
        setSupabaseUser(null);
        setIsAuthenticated(false);
        removeStorage(STORAGE_KEYS.authenticated);
      }
      setAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- Workspace lifecycle ----------------
  const clearWorkspaceData = () => {
    setTasks([]);
    setEvents([]);
    setTimetable([]);
    setNotes([]);
    setActivities([]);
    Object.values(STORAGE_KEYS)
      .filter((k) => k !== STORAGE_KEYS.authenticated && k !== STORAGE_KEYS.profile && k !== STORAGE_KEYS.settings)
      .forEach((key) => writeStorage(key, []));
  };

  // ---------------- Auth actions ----------------
  const signupWithSupabase = async (email: string, pass: string, fullName: string): Promise<AuthResult> => {
    clearWorkspaceData();
    if (!isSupabaseConfigured()) {
      login(email, fullName, true);
      return { data: { session: null }, error: null };
    }
    const res = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { full_name: fullName, name: fullName } },
    });
    if (!res.error && res.data.session) {
      setIsAuthenticated(true);
      writeStorage(STORAGE_KEYS.authenticated, true);
      setProfile((prev) => ({ ...prev, email, name: fullName }));
      addToast(`Account created! Welcome to your fresh Planora workspace, ${fullName}.`, 'success');
    }
    return { data: { session: res.data.session }, error: res.error };
  };

  const loginWithSupabase = async (email: string, pass: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured()) {
      login(email);
      return { data: { session: null }, error: null };
    }
    const res = await supabase.auth.signInWithPassword({ email, password: pass });
    if (!res.error && res.data.session) {
      setIsAuthenticated(true);
      writeStorage(STORAGE_KEYS.authenticated, true);
      const fullName = res.data.user?.user_metadata?.full_name || res.data.user?.user_metadata?.name;
      setProfile((prev) => ({ ...prev, email, name: fullName || prev.name }));
      addToast('Signed in successfully!', 'success');
    }
    return { data: { session: res.data.session }, error: res.error };
  };

  const loginWithGoogleSupabase = async (): Promise<AuthResult> => {
    if (!isSupabaseConfigured()) {
      login('alex.morgan@gmail.com', 'Alex Morgan');
      addToast('Signed in with Google!', 'success');
      return { data: { session: null }, error: null };
    }
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (data?.url) {
        console.info('Google OAuth authorize URL (verify this points to your Supabase project):', data.url);
      }
      if (error) {
        addToast(`Google authentication failed: ${error.message}`, 'error');
      }
      return { data: { session: null }, error };
    } catch (err) {
      console.error('Google OAuth error:', err);
      addToast('An error occurred during Google sign-in.', 'error');
      return { data: null, error: { message: 'Google sign-in failed' } };
    }
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
    removeStorage(STORAGE_KEYS.authenticated);
    lockVault();
    addToast('You have been logged out.', 'info');
  };

  const resetPasswordWithSupabase = async (
    email: string
  ): Promise<{ error: { message: string } | null }> => {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    return { error };
  };

  const login = (email?: string, name?: string, isNewSignUp: boolean = false) => {
    if (isNewSignUp) clearWorkspaceData();
    setIsAuthenticated(true);
    writeStorage(STORAGE_KEYS.authenticated, true);
    if (email || name) {
      setProfile((prev) => ({ ...prev, email: email || prev.email, name: name || prev.name }));
    }
    addToast(`Welcome to Planora, ${name || profile.name}!`, 'success');
  };

  const logout = () => {
    logoutWithSupabase();
  };

  const clearOauthSigninError = () => setOauthSigninError(null);

  // ---------------- Auto-persist ----------------
  useEffect(() => writeStorage(STORAGE_KEYS.tasks, tasks), [tasks]);
  useEffect(() => writeStorage(STORAGE_KEYS.events, events), [events]);
  useEffect(() => writeStorage(STORAGE_KEYS.timetable, timetable), [timetable]);
  useEffect(() => writeStorage(STORAGE_KEYS.notes, notes), [notes]);
  useEffect(() => writeStorage(STORAGE_KEYS.activities, activities), [activities]);
  useEffect(() => writeStorage(STORAGE_KEYS.profile, profile), [profile]);
  useEffect(() => writeStorage(STORAGE_KEYS.settings, settings), [settings]);

  // ---------------- Theme + accent application ----------------
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const applyTheme = () => {
      const isDark =
        settings.theme === 'dark' ||
        (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.classList.toggle('dark', isDark);
      body.classList.toggle('dark', isDark);
      root.dataset.accent = settings.accentColor;
    };

    applyTheme();

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.theme, settings.accentColor]);

  // ---------------- Keyboard shortcut: Cmd/Ctrl + K ----------------
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

  // ---------------- Task actions ----------------
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = { ...taskData, id: uid('task'), createdAt: new Date().toISOString() };
    setTasks((prev) => [newTask, ...prev]);
    addToast(`Task "${newTask.title}" created`, 'success');
    logActivity(`Created task "${newTask.title}"`, 'task_created', newTask.category);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    addToast('Task updated', 'info');
  };

  const deleteTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (target) addToast(`Task "${target.title}" deleted`, 'warning');
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextStatus: TaskStatus = t.status === 'completed' ? 'todo' : 'completed';
        const completedAt = nextStatus === 'completed' ? new Date().toISOString() : undefined;
        if (nextStatus === 'completed') {
          addToast(`Completed: ${t.title}`, 'success');
          logActivity(`Completed task "${t.title}"`, 'task_completed', t.category);
        }
        return { ...t, status: nextStatus, completedAt };
      })
    );
  };

  const toggleTaskFavorite = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const isFav = !t.isFavorite;
        addToast(isFav ? 'Added to favorites' : 'Removed from favorites', 'info');
        return { ...t, isFavorite: isFav };
      })
    );
  };

  const toggleTaskArchive = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const isArch = !t.isArchived;
        addToast(isArch ? 'Task archived' : 'Task restored', 'info');
        return { ...t, isArchived: isArch };
      })
    );
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return { ...t, status, completedAt: status === 'completed' ? new Date().toISOString() : undefined };
      })
    );
  };

  // ---------------- Event actions ----------------
  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = { ...eventData, id: uid('event') };
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

  // ---------------- Timetable actions ----------------
  const addTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = { ...slotData, id: uid('tt') };
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

  // ---------------- Note actions ----------------
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = { ...noteData, id: uid('note'), createdAt: now, updatedAt: now };
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
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n)));
    addToast('Note favorite toggled', 'info');
  };

  const toggleNoteArchive = (id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isArchived: !n.isArchived } : n)));
    addToast('Note archive updated', 'info');
  };

  const updateNoteBlocks = (noteId: string, blocks: NoteBlock[]) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, blocks, updatedAt: new Date().toISOString() } : n))
    );
  };

  // ---------------- Settings ----------------
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    addToast('Settings saved', 'info');
  };

  // ---------------- Derived selectors ----------------
  const activeTasks = useMemo(() => tasks.filter((t) => !t.isArchived), [tasks]);
  const completedTasks = useMemo(() => activeTasks.filter((t) => t.status === 'completed'), [activeTasks]);
  const todayStr = todayISO();
  const todayTasks = useMemo(() => activeTasks.filter((t) => t.dueDate === todayStr), [activeTasks, todayStr]);
  const upcomingTasks = useMemo(
    () => activeTasks.filter((t) => t.dueDate > todayStr && t.status !== 'completed'),
    [activeTasks, todayStr]
  );
  const overdueTasks = useMemo(
    () => activeTasks.filter((t) => t.dueDate < todayStr && t.status !== 'completed'),
    [activeTasks, todayStr]
  );
  const highPriorityTasks = useMemo(
    () => activeTasks.filter((t) => t.priority === 'high' && t.status !== 'completed'),
    [activeTasks]
  );

  const value: AppContextType = {
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
    hasVaultPin,
    isVaultUnlocked,
    setVaultPin,
    unlockVault,
    lockVault,
    resetVaultPin,
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};