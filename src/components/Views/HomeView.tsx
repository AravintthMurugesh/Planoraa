import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  TrendingUp,
  Sparkles,
  Plus,
  ArrowUpRight,
  CheckSquare,
  Calendar as CalendarIcon,
  Quote as QuoteIcon,
  ListTodo,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useApp } from '../../context/appcontext.tsx';
import { productivityQuotes } from '../../data/initialData';

export const HomeView: React.FC = () => {
  const {
    profile,
    activeTasks,
    completedTasks,
    todayTasks,
    overdueTasks,
    upcomingTasks,
    activities,
    setActiveTab,
    setQuickTaskModalOpen,
    toggleTaskComplete,
  } = useApp();

  const [quoteIndex, setQuoteIndex] = useState(0);

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

  // Chart data
  const chartData = [
    { day: 'Mon', completed: 4, created: 5 },
    { day: 'Tue', completed: 6, created: 4 },
    { day: 'Wed', completed: 3, created: 6 },
    { day: 'Thu', completed: 8, created: 5 },
    { day: 'Fri', completed: 7, created: 3 },
    { day: 'Sat', completed: 5, created: 2 },
    { day: 'Sun', completed: 6, created: 3 },
  ];

  const currentQuote = productivityQuotes[quoteIndex % productivityQuotes.length];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Card & Progress Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-7 rounded-[20px] bg-gradient-to-br from-[#4F46E5] to-[#6366F1] text-white relative overflow-hidden shadow-lg shadow-indigo-500/15 flex flex-col justify-between min-h-[200px]"
        >
          <div className="space-y-3 relative z-10">
            <div className="text-sm font-medium opacity-90">
              {todayDateStr}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {profile.name.split(' ')[0]}!
            </h1>
            <p className="opacity-80 font-medium text-sm md:text-base italic max-w-lg">
              "{currentQuote.quote}"
            </p>
          </div>

          <div className="mt-6 pt-4 flex items-center justify-between border-t border-white/20 relative z-10 text-xs">
            <span className="font-medium opacity-90">— {currentQuote.author}</span>
            <button
              onClick={() => setQuoteIndex((prev) => prev + 1)}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Next Quote
            </button>
          </div>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-slate-100/90 dark:bg-slate-900 p-6 rounded-[20px] border border-slate-300 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center"
        >
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#CBD5E1"
                className="dark:stroke-slate-800"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="3"
                strokeDasharray={`${todayCompletionPercentage}, 100`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-[#111827] dark:text-white">
                {todayCompletionPercentage}%
              </span>
              <span className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase mt-0.5">
                DONE
              </span>
            </div>
          </div>

          <div className="text-center mt-5">
            <div className="font-semibold text-sm text-[#111827] dark:text-white">Today's Progress</div>
            <div className="text-xs text-[#6B7280] dark:text-slate-400 mt-1">
              {todayCompletedCount} of {todayTotal} tasks completed
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-100/90 dark:bg-slate-900 p-5 rounded-[18px] border border-slate-300 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
        >
          <div className="text-[12px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
            Tasks
          </div>
          <div className="text-2xl font-bold text-[#111827] dark:text-white my-1">
            {totalTasksCount}
          </div>
          <div className="text-[#22C55E] text-[11px] font-medium">
            +{activeTasks.length} active
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-100/90 dark:bg-slate-900 p-5 rounded-[18px] border border-slate-300 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
        >
          <div className="text-[12px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
            Completed
          </div>
          <div className="text-2xl font-bold text-[#111827] dark:text-white my-1">
            {completedCount}
          </div>
          <div className="text-[#6B7280] dark:text-slate-400 text-[11px] font-medium">
            {overallCompletionPercentage}% efficiency
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-100/90 dark:bg-slate-900 p-5 rounded-[18px] border border-slate-300 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
        >
          <div className="text-[12px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
            Pending
          </div>
          <div className="text-2xl font-bold text-[#111827] dark:text-white my-1">
            {pendingCount}
          </div>
          <div className="text-[#EF4444] text-[11px] font-medium">
            {overdueCount > 0 ? `${overdueCount} overdue` : 'On track'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-slate-100/90 dark:bg-slate-900 p-5 rounded-[18px] border border-slate-300 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
        >
          <div className="text-[12px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
            Streak
          </div>
          <div className="text-2xl font-bold text-[#111827] dark:text-white my-1">
            14
          </div>
          <div className="text-[#F59E0B] text-[11px] font-medium">
            Personal best!
          </div>
        </motion.div>
      </div>

      {/* Main Bottom Section Grid: Recent Activity, Upcoming Deadlines, Productivity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-100/90 dark:bg-slate-900 p-6 rounded-[20px] border border-slate-300 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1] dark:border-slate-800">
            <h3 className="font-bold text-base text-[#111827] dark:text-white">Recent Activity</h3>
            <button
              onClick={() => setActiveTab('todo')}
              className="text-xs font-semibold text-[#4F46E5] dark:text-indigo-400 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 4).map((act) => (
              <div key={act.id} className="flex items-center gap-3 py-2 border-b border-[#CBD5E1]/60 dark:border-slate-800/60 last:border-b-0">
                <div className="w-5 h-5 rounded-md bg-[#4F46E5] border border-[#4F46E5] flex items-center justify-center text-white text-xs shrink-0">
                  ✓
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#111827] dark:text-white truncate">
                    {act.title}
                  </div>
                  <div className="text-[11px] text-[#6B7280] dark:text-slate-400 mt-0.5">
                    {act.timestamp}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#FEF3C7] text-[#D97706] shrink-0">
                  Medium
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-slate-100/90 dark:bg-slate-900 p-6 rounded-[20px] border border-slate-300 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1] dark:border-slate-800">
            <h3 className="font-bold text-base text-[#111827] dark:text-white">Upcoming Deadlines</h3>
            <button
              onClick={() => setActiveTab('todo')}
              className="text-xs font-semibold text-[#4F46E5] dark:text-indigo-400 hover:underline cursor-pointer"
            >
              All Deadlines
            </button>
          </div>

          <div className="space-y-3">
            {upcomingTasks.slice(0, 3).map((task, idx) => (
              <div
                key={task.id}
                style={{ borderLeftColor: idx === 0 ? '#EF4444' : '#F59E0B' }}
                className="bg-slate-200/80 dark:bg-slate-800/50 rounded-xl p-3 border-l-4 border-y border-r border-[#CBD5E1] dark:border-slate-800/80"
              >
                <div className="text-xs font-bold text-[#111827] dark:text-white truncate">
                  {task.title}
                </div>
                <div
                  style={{ color: idx === 0 ? '#EF4444' : '#F59E0B' }}
                  className="text-[11px] font-medium mt-1"
                >
                  Due {task.dueDate}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Productivity Bar Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-100/90 dark:bg-slate-900 p-6 rounded-[20px] border border-slate-300 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between"
        >
          <h3 className="font-bold text-base text-[#111827] dark:text-white mb-4">Productivity</h3>

          <div className="flex items-end gap-2.5 h-28 my-2">
            <div className="flex-1 bg-[#E2E8F0] dark:bg-slate-800 h-[40%] rounded-md" />
            <div className="flex-1 bg-[#E2E8F0] dark:bg-slate-800 h-[65%] rounded-md" />
            <div className="flex-1 bg-[#4F46E5] h-[90%] rounded-md shadow-xs" />
            <div className="flex-1 bg-[#E2E8F0] dark:bg-slate-800 h-[50%] rounded-md" />
            <div className="flex-1 bg-[#4F46E5] h-[75%] rounded-md shadow-xs" />
            <div className="flex-1 bg-[#E2E8F0] dark:bg-slate-800 h-[45%] rounded-md" />
            <div className="flex-1 bg-[#E2E8F0] dark:bg-slate-800 h-[30%] rounded-md" />
          </div>

          <div className="flex justify-between text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
            <span>MON</span>
            <span>WED</span>
            <span>FRI</span>
            <span>SUN</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setQuickTaskModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-[#4F46E5] hover:bg-indigo-700 rounded-full flex items-center justify-center text-white shadow-[0_8px_25px_rgba(79,70,229,0.4)] text-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Quick Add Task"
      >
        +
      </button>
    </div>
  );
};
