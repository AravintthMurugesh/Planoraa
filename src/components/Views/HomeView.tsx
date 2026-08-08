import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  CheckSquare,
  Sun,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { productivityQuotes } from '../../data/initialData';

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
  } = useApp();

  // Time-based Greeting
  const currentHour = new Date().getHours();
  let timeGreeting = 'Good morning';
  if (currentHour >= 12 && currentHour < 17) timeGreeting = 'Good afternoon';
  if (currentHour >= 17) timeGreeting = 'Good evening';

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate stats
  const totalTasksCount = activeTasks.length;
  const completedCount = completedTasks.length;
  const pendingCount = totalTasksCount - completedCount;
  const overdueCount = overdueTasks.length;
  const todayCompletedCount = todayTasks.filter((t) => t.status === 'completed').length;
  const todayTotal = Math.max(1, todayTasks.length);
  const todayCompletionPercentage = Math.round((todayCompletedCount / todayTotal) * 100);

  const overallCompletionPercentage = totalTasksCount > 0
    ? Math.round((completedCount / totalTasksCount) * 100)
    : 100;

  const currentQuote = productivityQuotes[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Hero Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Command Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden border border-indigo-500/30 shadow-2xl shadow-indigo-950/50 flex flex-col justify-between min-h-[220px] group"
        >
          {/* Subtle ambient lighting flares */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-300">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>{todayDateStr}</span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {timeGreeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300">{profile.name.split(' ')[0]}</span> 👋
              </h1>
              <p className="mt-2 text-slate-300 font-medium text-xs sm:text-sm italic max-w-xl leading-relaxed">
                "{currentQuote.quote}"
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 flex items-center justify-between border-t border-white/10 relative z-10 text-xs">
            <span className="font-bold text-indigo-300">— {currentQuote.author}</span>
            <button
              onClick={() => setQuickTaskModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-300" />
              <span>Create Task</span>
            </button>
          </div>
        </motion.div>

        {/* Daily Completion Score Circle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 rounded-3xl glass-panel p-6 flex flex-col items-center justify-center text-center relative overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="3.2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradientScore)"
                strokeWidth="3.2"
                strokeDasharray={`${todayCompletionPercentage}, 100`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white tracking-tight">
                {todayCompletionPercentage}%
              </span>
              <span className="text-[10px] font-black text-indigo-400 tracking-widest uppercase mt-0.5">
                TODAY SCORE
              </span>
            </div>
          </div>

          <div className="text-center mt-3">
            <div className="font-bold text-xs text-white">Daily Velocity Target</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {todayCompletedCount} of {todayTotal} tasks completed today
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl glass-panel p-5 flex flex-col justify-between border border-white/10 hover:border-indigo-500/40 transition-all hover:shadow-xl hover:shadow-indigo-500/10 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Total Queue
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{totalTasksCount}</div>
            <div className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{activeTasks.length} active in workflow</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-panel p-5 flex flex-col justify-between border border-white/10 hover:border-emerald-500/40 transition-all hover:shadow-xl hover:shadow-emerald-500/10 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Completed
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{completedCount}</div>
            <div className="text-[11px] font-bold text-slate-400 mt-1">
              {overallCompletionPercentage}% completion rate
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl glass-panel p-5 flex flex-col justify-between border border-white/10 hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/10 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Pending
            </span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{pendingCount}</div>
            <div className={`text-[11px] font-bold mt-1 ${overdueCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {overdueCount > 0 ? `${overdueCount} items overdue` : 'On track & clean'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Section: Active Focus Queue */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full rounded-3xl glass-panel p-6 border border-white/10 space-y-4 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="font-extrabold text-sm text-white">Focus Action Queue</h3>
          </div>
          <button
            onClick={() => setActiveTab('todo')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {activeTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-bold">
              🎉 No active tasks in queue! Relax or create a new one.
            </div>
          ) : (
            activeTasks.slice(0, 6).map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="w-5 h-5 rounded-lg border border-slate-600 hover:border-indigo-400 hover:bg-indigo-500/20 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                  >
                    {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400 font-semibold">{task.category}</span>
                      <span className="text-[10px] text-slate-500">•</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 border ${
                    task.priority === 'high'
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : task.priority === 'medium'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <button
        onClick={() => setQuickTaskModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl text-white shadow-2xl shadow-indigo-600/40 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/20 flex items-center justify-center group"
        title="Quick Create Task"
      >
        <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform" />
      </button>
    </div>
  );
};

