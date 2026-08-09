import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  CheckSquare,
  Sun,
  Sparkles,
  ChevronRight,
  Archive,
  Target,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { productivityQuotes } from '../../data/initialData';
import { PRIORITY_META } from '../../lib/meta';
import { cn, greetingForHour } from '../../lib/utils';
import { staggerContainer, staggerItem, celebrateCompletion } from '../../lib/animations';
import { AnimatedCounter } from '../AnimatedCounter';
import { TiltCard } from '../TiltCard';

export const HomeView: React.FC = () => {
  const {
    profile,
    activeTasks,
    completedTasks,
    todayTasks,
    overdueTasks,
    setActiveTab,
    setQuickTaskModalOpen,
    toggleTaskComplete,
    toggleTaskArchive,
  } = useApp();

  const timeGreeting = greetingForHour(new Date().getHours());

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const totalTasksCount = activeTasks.length;
  const completedCount = completedTasks.length;
  const pendingCount = totalTasksCount - completedCount;
  const overdueCount = overdueTasks.length;
  const todayCompletedCount = todayTasks.filter((t) => t.status === 'completed').length;
  const todayTotal = Math.max(1, todayTasks.length);
  const todayCompletionPercentage = Math.round((todayCompletedCount / todayTotal) * 100);

  const overallCompletionPercentage =
    totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 100;

  const currentQuote = productivityQuotes[0];

  // Mouse-tracked hero spotlight
  const heroRef = useRef<HTMLDivElement>(null);
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(30);
  const spotXSpring = useSpring(spotX, { stiffness: 120, damping: 24 });
  const spotYSpring = useSpring(spotY, { stiffness: 120, damping: 24 });
  const heroSpotlight = useMotionTemplate`radial-gradient(520px circle at ${spotXSpring}% ${spotYSpring}%, rgba(129,140,248,0.18), transparent 65%)`;

  const handleHeroMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    spotX.set(((e.clientX - rect.left) / rect.width) * 100);
    spotY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleToggleComplete = (id: string, isCompleted: boolean) => {
    toggleTaskComplete(id);
    if (!isCompleted) celebrateCompletion();
  };

const stats = [
    {
      label: 'Total Queue',
      value: totalTasksCount,
      sub: `${activeTasks.length} active in workflow`,
      icon: CheckSquare,
      iconClass: 'bg-[var(--accent-soft)] text-[var(--accent-color)]',
      hoverBorder: 'hover:border-[var(--accent-color)]/40 hover:shadow-[var(--accent-soft)]',
      showTrend: true,
    },
    {
      label: 'Completed',
      value: completedCount,
      sub: `${overallCompletionPercentage}% completion rate`,
      icon: CheckCircle2,
      iconClass: 'bg-emerald-500/15 text-emerald-500',
      hoverBorder: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
      showTrend: false,
    },
    {
      label: 'Pending',
      value: pendingCount,
      sub: overdueCount > 0 ? `${overdueCount} items overdue` : 'On track & clean',
      icon: Clock,
      iconClass: 'bg-amber-500/15 text-amber-500',
      hoverBorder: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
      showTrend: false,
      subClass: overdueCount > 0 ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-500 dark:text-emerald-400',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ---------- Hero ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <motion.div
          ref={heroRef}
          onMouseMove={handleHeroMove}
          initial={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F1526] via-[#171334] to-[#0B0F19] text-white relative overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between min-h-[220px] group"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: heroSpotlight }}
          />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-[var(--accent-color)]/15 group-hover:scale-125 transition-transform duration-700 animate-float-slow" />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-[var(--accent-color)]/10 animate-float" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] rounded-full border border-white/5 orbit-ring" style={{ ['--orbit-duration' as string]: '28s' }} />
          <div
            className="absolute inset-0 opacity-[0.35] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 40%)',
            }}
          />

          <div className="space-y-4 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-300 animate-fade-up">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>{todayDateStr}</span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {timeGreeting},{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 text-gradient-animate">
                  {profile.name.split(' ')[0]}
                </span>{' '}
                👋
              </h1>
              <p className="mt-2 text-slate-300 font-medium text-xs sm:text-sm italic max-w-xl leading-relaxed">
                &ldquo;{currentQuote.quote}&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 flex items-center justify-between border-t border-white/10 relative z-10 text-xs">
            <span className="font-bold text-indigo-300">— {currentQuote.author}</span>
            <button
              onClick={() => setQuickTaskModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer btn-press btn-shine hover-wiggle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>
        </motion.div>

        {/* Daily score */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 rounded-3xl glass-panel p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group"
        >
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl pointer-events-none bg-[var(--accent-soft)] group-hover:scale-125 transition-transform duration-700" />
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute -inset-3 rounded-full orbit-ring" style={{ ['--orbit-duration' as string]: '14s' }} />
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                className="stroke-slate-200/80 dark:stroke-white/10"
                strokeWidth="3.2"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradientScore)"
                strokeWidth="3.2"
                strokeLinecap="round"
                animate={{ pathLength: todayCompletionPercentage / 100 }}
                transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ filter: 'drop-shadow(0 0 6px rgba(129,140,248,0.55))' }}
              />
              <defs>
                <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-color)" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <AnimatedCounter
                value={todayCompletionPercentage}
                duration={1.2}
                suffix="%"
                className="text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums"
              />
              <span className="text-[10px] font-black text-[var(--accent-color)] tracking-widest uppercase mt-0.5">
                Today Score
              </span>
            </div>
          </div>

          <div className="text-center mt-3">
            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
              <Target className="w-3 h-3 text-[var(--accent-color)]" />
              Daily Velocity Target
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {todayCompletedCount} of {todayTotal} tasks completed today
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---------- Stats ---------- */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} variants={staggerItem} className="group">
              <TiltCard
                className={cn(
                  'rounded-2xl glass-panel p-5 flex flex-col justify-between card-lift h-full',
                  s.hoverBorder
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {s.label}
                  </span>
                  <div className={cn('p-2 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6', s.iconClass)}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <AnimatedCounter
                    value={s.value}
                    duration={1 + idx * 0.15}
                    className="text-3xl font-black text-slate-900 dark:text-white tabular-nums"
                  />
                  <div
                    className={cn(
                      'text-[11px] font-bold mt-1 flex items-center gap-1',
                      s.subClass ?? 'text-slate-500 dark:text-slate-400'
                    )}
                  >
                    {s.sub && <TrendingUp className="w-3 h-3" />}
                    <span>{s.sub}</span>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ---------- Focus queue ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.32, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full rounded-3xl glass-panel p-6 space-y-4 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-color)]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Focus Action Queue
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('todo')}
            className="text-xs font-bold text-[var(--accent-color)] hover:opacity-80 flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
          {activeTasks.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                No active tasks in queue! Relax or create a new one.
              </p>
            </div>
          ) : (
            activeTasks.slice(0, 6).map((task) => {
              const priority = PRIORITY_META[task.priority];
              return (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-[var(--accent-color)]/30 transition-all flex items-center justify-between gap-3 group card-lift"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleComplete(task.id, task.status === 'completed')}
                      className={cn(
                        'w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 cursor-pointer btn-press',
                        task.status === 'completed'
                          ? 'border-emerald-500 bg-emerald-500/20'
                          : 'border-slate-400 dark:border-slate-600 hover:border-[var(--accent-color)] hover:bg-[var(--accent-soft)]'
                      )}
                      title="Toggle complete"
                    >
                      <motion.span
                        key={task.status}
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className="flex items-center justify-center"
                      >
                        {task.status === 'completed' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                        )}
                      </motion.span>
                    </button>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          'text-xs font-bold truncate transition-colors group-hover:text-[var(--accent-color)]',
                          task.status === 'completed'
                            ? 'text-slate-400 line-through'
                            : 'text-slate-900 dark:text-white'
                        )}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                          {task.category}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">•</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tabular-nums">
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0',
                      priority.badge
                    )}
                  >
                    {priority.label}
                  </span>

                  <button
                    onClick={() => toggleTaskArchive(task.id)}
                    className="p-1.5 text-slate-400 hover:text-[var(--accent-color)] hover:bg-[var(--accent-soft)] rounded-lg transition-colors shrink-0 cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Move to Vault"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Floating action button */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.55, type: 'spring', stiffness: 260, damping: 18 }}
        onClick={() => setQuickTaskModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-tr from-[var(--accent-color)] to-[var(--accent-hover)] rounded-2xl text-white shadow-2xl shadow-[var(--accent-soft)] hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/20 flex items-center justify-center group glow-pulse"
        title="Quick Create Task"
        whileHover={{ scale: 1.1, rotate: 6 }}
        whileTap={{ scale: 0.92 }}
      >
        <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>
    </div>
  );
};