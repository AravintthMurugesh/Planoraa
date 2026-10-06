import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Command,
  CheckSquare,
  Lightbulb,
  Sparkles,
  Crown,
  Wand2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewTab } from '../../types';
import { cn } from '../../lib/utils';
import { PlanoraAvatar } from './PlanoraAvatar';
import {
  planoraTabMessages,
  planoraSpecialMessages,
  planoraFallbackMessage,
  planoraOnboardingMessages,
  PLANORA_INTRO_KEY,
  PLANORA_PANEL_WELCOME_KEY,
  PlanoraContextMessage,
} from './assistantData';

const BUBBLE_DELAY = 650;
const BUBBLE_DURATION = 5200;
const ONBOARDING_START = 1000;
const ONBOARDING_SWAP = 4800;
const ONBOARDING_END = 9200;

const EASE = [0.16, 1, 0.3, 1] as const;

const TAB_LABELS: Record<ViewTab, string> = {
  home: 'Dashboard',
  todo: 'Tasks Matrix',
  tracker: 'Task Flow',
  calendar: 'Calendar Grid',
  timetable: 'Schedule Hub',
  notes: 'Notes',
  favorites: 'Starred Items',
  archive: 'Vault Archive',
  settings: 'Settings',
};

const TAB_STEPS: Partial<Record<ViewTab, string[]>> = {
  home: ['Scan your daily score', 'Clear the focus queue', 'Plan tomorrow'],
  todo: ['Add a task', 'Set priority + deadline', 'Complete & celebrate'],
  tracker: ['Pick up a task', 'Move it to In Progress', 'Land it in Done'],
  calendar: ['Add an event', 'Set a reminder', 'Review the week ahead'],
  timetable: ['Map your weekly rhythm', 'Mark deep-work blocks', 'Protect your breaks'],
  notes: ['Capture a thought', 'Block-format the note', 'Star what matters'],
  favorites: ['Star a task or note', 'It lands here', 'Jump back anytime'],
  archive: ['Archive finished items', 'Keep the vault tidy', 'Restore if ever needed'],
  settings: ['Pick your accent', 'Tune the appearance', 'Your data stays yours'],
};

const WELCOME_POINTS = [
  {
    icon: Command,
    title: 'Command palette',
    desc: 'Press Ctrl/⌘ + K to jump anywhere in seconds.',
  },
  {
    icon: Wand2,
    title: 'Curate with purpose',
    desc: 'Star the essentials, archive the rest — keep your flow clean.',
  },
  {
    icon: CheckSquare,
    title: 'Tasks & flow',
    desc: 'Capture tasks fast and move them through your daily flow.',
  },
];

export const PlanoraAssistant: React.FC = () => {
  const {
    activeTab,
    isCommandPaletteOpen,
    isQuickTaskModalOpen,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [bubble, setBubble] = useState<{ key: string; text: string } | null>(null);
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);

  const avatarBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const prevTabRef = useRef<ViewTab>(activeTab);

  // First-ever open — one-time concierge welcome, remembered locally.
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(PLANORA_PANEL_WELCOME_KEY) === 'true';
    } catch {
      seen = false;
    }
    setHasSeenWelcome(seen);
  }, []);

  const scheduleTimeout = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  };

  const clearTimeouts = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  };

  useEffect(() => () => clearTimeouts(), []);

  // ------------------------------------------------------------------
  // Context resolution — driven entirely by the existing app state.
  // ------------------------------------------------------------------
  const context = useMemo<PlanoraContextMessage>(() => {
    if (isCommandPaletteOpen) return planoraSpecialMessages.commandPalette;
    if (isQuickTaskModalOpen) return planoraSpecialMessages.quickAdd;
    return planoraTabMessages[activeTab] ?? planoraFallbackMessage;
  }, [activeTab, isCommandPaletteOpen, isQuickTaskModalOpen]);

  // ------------------------------------------------------------------
  // First-run onboarding — a short, dismissible introduction.
  // ------------------------------------------------------------------
  useEffect(() => {
    let introSeen = false;
    try {
      introSeen = localStorage.getItem(PLANORA_INTRO_KEY) === 'true';
    } catch {
      introSeen = false;
    }
    if (introSeen) return;

    scheduleTimeout(
      () => setBubble({ key: 'onboarding-1', text: planoraOnboardingMessages[0] }),
      ONBOARDING_START
    );
    scheduleTimeout(
      () => setBubble({ key: 'onboarding-2', text: planoraOnboardingMessages[1] }),
      ONBOARDING_SWAP
    );
    scheduleTimeout(() => {
      setBubble(null);
      try {
        localStorage.setItem(PLANORA_INTRO_KEY, 'true');
      } catch {
        // best-effort
      }
    }, ONBOARDING_END);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------
  // Contextual first message — once per page visit during the session.
  // ------------------------------------------------------------------
  useEffect(() => {
    if (prevTabRef.current === activeTab) return;
    prevTabRef.current = activeTab;
    if (isOpen) return;

    clearTimeouts();
    const ctx = planoraTabMessages[activeTab] ?? planoraFallbackMessage;
    scheduleTimeout(
      () => setBubble({ key: `tab-${activeTab}`, text: ctx.intro }),
      BUBBLE_DELAY
    );
    scheduleTimeout(() => setBubble(null), BUBBLE_DURATION);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isOpen]);

  // ------------------------------------------------------------------
  // Escape closes the panel; focus is moved for keyboard users.
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isCommandPaletteOpen) {
        e.preventDefault();
        closePanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const focusTimer = window.setTimeout(() => closeBtnRef.current?.focus(), 80);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(focusTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isCommandPaletteOpen]);

  const openPanel = () => {
    clearTimeouts();
    setBubble(null);
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
    // The concierge welcome is a one-time experience — mark it seen.
    if (hasSeenWelcome === false) {
      try {
        localStorage.setItem(PLANORA_PANEL_WELCOME_KEY, 'true');
      } catch {
        // best-effort
      }
      setHasSeenWelcome(true);
    }
    avatarBtnRef.current?.focus();
  };

  const togglePanel = () => {
    if (isOpen) closePanel();
    else openPanel();
  };

  const steps = TAB_STEPS[activeTab] ?? TAB_STEPS.home!;

  return (
    <>
      {/* Speech bubble — contextual introduction for the current page */}
      <AnimatePresence>
        {bubble && (
          <motion.button
            type="button"
            key={bubble.key}
            onClick={openPanel}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="fixed z-40 bottom-24 sm:bottom-28 right-4 sm:right-6 w-[calc(100vw-2rem)] max-w-[330px] text-left"
          >
            <span className="block w-full rounded-2xl gradient-border bg-white/95 dark:bg-[#0D1226]/95 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/15 px-4 py-3 text-left cursor-pointer">
              <span className="flex items-center gap-2.5 pr-6">
                <PlanoraAvatar className="w-6 h-6 rounded-lg shrink-0" />
                <span className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">
                  Planora
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="ml-auto eyebrow text-[8px] text-slate-400 dark:text-slate-500 tracking-[0.2em]">
                  Guide
                </span>
              </span>
              <span className="block mt-2 text-xs font-semibold italic text-slate-600 dark:text-slate-300">
                {bubble.text}
              </span>
            </span>
            <span
              className="block w-3 h-3 rotate-45 -mt-1.5 ml-6 bg-white/95 dark:bg-[#0D1226]/95 border-b border-r border-slate-200/90 dark:border-white/10"
              aria-hidden="true"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Support panel — contextual help for the current section */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Planora assistant"
            initial={{ opacity: 0, scale: 0.88, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            style={{ transformOrigin: 'bottom right', position: 'fixed' }}
            className="fixed z-40 bottom-24 sm:bottom-28 right-4 sm:right-6 w-[calc(100vw-2rem)] max-w-[380px]"
          >
            {/* Ambient aura behind the panel */}
            <div
              className="absolute -inset-6 rounded-[3.5rem] blur-3xl pointer-events-none"
              style={{
                background:
                  'radial-gradient(58% 58% at 72% 18%, color-mix(in srgb, var(--accent-color) 30%, transparent), transparent 72%)',
              }}
              aria-hidden="true"
            />
            <div className="relative flex flex-col overflow-hidden glass-panel card-animated-border rounded-3xl max-h-[74vh]">
            {/* Header — luxe gradient banner */}
            <div className="relative overflow-hidden bg-[linear-gradient(140deg,#101728_0%,#1B1440_60%,#0B0F19_100%)] px-4 py-4 border-b border-white/10">
              <div className="absolute -top-14 -right-10 w-44 h-44 rounded-full blur-3xl pointer-events-none bg-[var(--accent-color)]/25 animate-float-slow" />
              <div className="absolute -bottom-12 -left-10 w-36 h-36 rounded-full blur-3xl pointer-events-none bg-purple-500/20 animate-float" />
              {hasSeenWelcome === false && (
                <div className="absolute -top-16 -left-12 w-40 h-40 rounded-full blur-3xl pointer-events-none bg-amber-400/15 animate-float-slow" />
              )}
              {/* Soft sheen sweep across the banner */}
              <div className="absolute inset-0 animate-shimmer pointer-events-none" aria-hidden="true" />

              <div className="relative flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-[var(--accent-color)]/35 blur-lg" />
                  {hasSeenWelcome === false && (
                    <div className="absolute inset-0 rounded-2xl bg-amber-300/30 blur-xl" />
                  )}
                  <PlanoraAvatar className="relative w-11 h-11 rounded-2xl drop-shadow-lg" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#101728]">
                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display italic font-semibold text-[16px] tracking-tight bg-gradient-to-r from-white via-indigo-100 to-white bg-clip-text text-transparent">
                      Planora
                    </span>
                    {hasSeenWelcome === false ? (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-400/15 border border-amber-300/30 text-amber-200 text-[8.5px] font-black uppercase tracking-[0.14em] flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5" />
                        Concierge
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-md bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/30 text-[var(--accent-color)] text-[8.5px] font-black uppercase tracking-[0.14em] flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-[var(--accent-color)]" />
                        Support
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10.5px] text-slate-300/80 font-semibold">
                      {hasSeenWelcome === false
                        ? 'Delighted to meet you'
                        : 'Your guide for this page'}
                    </span>
                    {/* Typing indicator */}
                    <span className="flex gap-1 items-center ml-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1 h-1 rounded-full bg-indigo-300"
                          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                        />
                      ))}
                    </span>
                  </div>
                </div>

                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={closePanel}
                  aria-label="Close Planora assistant"
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 bg-white/5 transition-colors cursor-pointer btn-press"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-4 py-4 no-scrollbar">
              {/* One-time concierge welcome — shown only on the very first open */}
              {hasSeenWelcome === false && (
                <motion.div
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.45, ease: EASE }}
                  className="relative overflow-hidden rounded-3xl border border-amber-200/25 bg-[linear-gradient(150deg,#1A1533_0%,#141829_55%,#10152B_100%)] px-4 py-4"
                >
                  <div className="absolute -top-12 -right-10 w-36 h-36 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-8 w-28 h-28 rounded-full bg-[var(--accent-color)]/20 blur-3xl pointer-events-none animate-float-slow" />
                  <Sparkles className="absolute top-3 right-3 w-4 h-4 text-amber-300/80 animate-spin-slow" aria-hidden="true" />

                  <div className="relative">
                    <span className="eyebrow text-[8.5px] text-amber-300/90 tracking-[0.24em] flex items-center gap-1.5">
                      <Crown className="w-3 h-3" />
                      Concierge Welcome
                    </span>
                    <h3 className="mt-2 font-display text-[22px] leading-tight tracking-tight text-white">
                      Welcome to{' '}
                      <span className="text-gradient-animate italic">Planora</span>
                    </h3>
                    <p className="mt-1.5 font-display italic text-[12.5px] text-slate-300/90">
                      Your workspace, elevated — let me show you around.
                    </p>

                    <div className="hairline my-3.5 text-amber-200/40" />

                    <div className="flex flex-col gap-2.5">
                      {WELCOME_POINTS.map((p, i) => {
                        const Icon = p.icon;
                        return (
                          <motion.div
                            key={p.title}
                            initial={{ opacity: 0, x: 14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.22 + i * 0.09, duration: 0.4, ease: EASE }}
                            className="flex items-center gap-3"
                          >
                            <span className="shrink-0 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-200">
                              <Icon className="w-3.5 h-3.5" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-white leading-tight">
                                {p.title}
                              </p>
                              <p className="text-[9.5px] font-semibold text-slate-400 leading-tight mt-0.5">
                                {p.desc}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Context message */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="eyebrow text-[8.5px] text-slate-400 dark:text-slate-500 tracking-[0.22em]">
                    {isCommandPaletteOpen || isQuickTaskModalOpen ? 'Now Showing' : 'In This Section'}
                  </span>
                  {!isCommandPaletteOpen && !isQuickTaskModalOpen && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent-color)] border border-[var(--accent-soft)] text-[9px] font-black uppercase tracking-[0.12em]">
                      {TAB_LABELS[activeTab]}
                    </span>
                  )}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={context.message}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -14 }}
                    transition={{ duration: 0.22, ease: EASE }}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/[0.04] dark:bg-white/[0.05] border border-slate-200/70 dark:border-white/[0.07]"
                  >
                    <span className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent-soft)] to-transparent border border-[var(--accent-soft)] flex items-center justify-center text-lg">
                      {context.emoji}
                    </span>
                    <p className="text-[12.5px] leading-relaxed font-medium text-slate-600 dark:text-slate-300 flex-1">
                      {context.message}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence initial={false}>
                  {context.tip && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 rounded-2xl bg-[var(--accent-soft)]/60 dark:bg-[var(--accent-soft)]/25 border border-[var(--accent-color)]/15 px-3.5 py-2.5 text-[11.5px] font-semibold text-slate-700 dark:text-slate-200 flex items-start gap-2.5">
                        <Lightbulb className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                        <span>{context.tip}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contextual path */}
              <div>
                <span className="block eyebrow text-[8.5px] text-slate-400 dark:text-slate-500 tracking-[0.22em] mb-2.5">
                  Your Path in {TAB_LABELS[activeTab]}
                </span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="flex flex-col"
                  >
                    {steps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={cn(
                              'w-6 h-6 rounded-full text-[9.5px] font-black flex items-center justify-center transition-all duration-300',
                              i === 0
                                ? 'bg-[var(--accent-color)] text-white shadow-md shadow-[var(--accent-soft)] scale-105'
                                : 'bg-slate-900/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-white/10'
                            )}
                          >
                            {i + 1}
                          </span>
                          {i < steps.length - 1 && (
                            <span className="w-px flex-1 min-h-[10px] bg-gradient-to-b from-slate-300/70 to-slate-200/40 dark:from-white/15 dark:to-white/5" />
                          )}
                        </div>
                        <p
                          className={cn(
                            'text-[11.5px] font-bold pb-3.5 transition-colors',
                            i === 0
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-500 dark:text-slate-400'
                          )}
                        >
                          {step}
                          {i === 0 && (
                            <span className="ml-2 px-1.5 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent-color)] text-[8.5px] font-black uppercase tracking-[0.14em] align-middle">
                              Start here
                            </span>
                          )}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-4 py-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2.5">
              <div className="hidden sm:flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded-md bg-slate-900/5 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[9px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                  Esc
                </kbd>
                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500">
                  to close
                </span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={closePanel}
                  className="px-4 py-2 rounded-xl btn-luxe text-xs cursor-pointer"
                >
                  {hasSeenWelcome === false ? "Let's go" : 'Got it'}
                </button>
              </div>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Closed state — floating mascot with hover tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.4 }}
        className="fixed z-40 bottom-4 right-4 sm:bottom-6 sm:right-6"
      >
        <div className="group relative">
          {/* Avatar button */}
          <div className="planora-float relative">
            {/* Orbit ring */}
            <div
              className={cn(
                'absolute -inset-2 rounded-full orbit-ring transition-opacity duration-300',
                isOpen ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'
              )}
              style={{ ['--orbit-duration' as string]: '10s' }}
            />
            <button
              ref={avatarBtnRef}
              type="button"
              onClick={togglePanel}
              aria-label="Open Planora assistant"
              aria-expanded={isOpen}
              aria-haspopup="dialog"
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl cursor-pointer btn-press focus-visible:outline-none transition-transform group-hover:scale-105 duration-200 overflow-visible gradient-ring"
            >
              <span
                className={cn(
                  'absolute -inset-1 rounded-3xl blur-md transition-colors duration-300',
                  isOpen ? 'bg-[var(--accent-color)]/35' : 'bg-[var(--accent-color)]/20 animate-pulse'
                )}
                aria-hidden="true"
              />
              <PlanoraAvatar className="relative w-full h-full drop-shadow-lg" />

              {/* Action sparks badge */}
              <span
                className={cn(
                  'absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 shadow-md flex items-center justify-center transition-transform duration-300',
                  isOpen ? 'scale-0 rotate-90' : 'group-hover:scale-110 group-hover:rotate-12'
                )}
              >
                <Sparkles className="w-2.5 h-2.5 text-[var(--accent-color)]" />
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};