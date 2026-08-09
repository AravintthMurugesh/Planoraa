import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Kanban,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  Calendar,
  CheckSquare,
  ArrowRight,
  Sparkles,
  Archive,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus } from '../../types';
import { PRIORITY_META, TASK_STATUS_META } from '../../lib/meta';
import { celebrateCompletion } from '../../lib/animations';
import { AnimatedCounter } from '../AnimatedCounter';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Under Review' },
  { id: 'completed', title: 'Completed' },
];

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  todo: 'in_progress',
  in_progress: 'review',
  review: 'completed',
  completed: 'todo',
};

export const TaskTrackerKanbanView: React.FC = () => {
  const { activeTasks, updateTaskStatus, toggleTaskArchive, setQuickTaskModalOpen, setActiveTab } =
    useApp();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const totalCount = activeTasks.length;
  const completedCount = activeTasks.filter((t) => t.status === 'completed').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;
  const inProgressCount = activeTasks.filter((t) => t.status === 'in_progress').length;
  const reviewCount = activeTasks.filter((t) => t.status === 'review').length;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;
    updateTaskStatus(taskId, targetStatus);
    if (targetStatus === 'completed') {
      celebrateCompletion(0);
    }
    setDraggedTaskId(null);
  };

  const metrics = [
    { label: 'Completion Rate', value: completionRate, suffix: '%', icon: TrendingUp, tint: 'text-[var(--accent-color)] bg-[var(--accent-soft)]' },
    { label: 'In Active Progress', value: inProgressCount, suffix: '', icon: Clock, tint: 'text-blue-500 bg-blue-500/10' },
    { label: 'Under Review', value: reviewCount, suffix: '', icon: Sparkles, tint: 'text-amber-500 bg-amber-500/10' },
    { label: 'Completed Cards', value: completedCount, suffix: '', icon: CheckCircle2, tint: 'text-emerald-500 bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Kanban className="w-7 h-7 text-[var(--accent-color)]" />
            <span>Task Flow Board</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Visual pipeline — drag and drop tasks across execution stages.
          </p>
        </div>

        <button
          onClick={() => setQuickTaskModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-[var(--accent-soft)] btn-press flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Task Card</span>
        </button>
      </div>

      {/* ---------- Metrics ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="glass-card p-4 flex items-center gap-4 card-lift group">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${m.tint}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                  <AnimatedCounter value={m.value} duration={1} suffix={m.suffix} />
                </p>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">{m.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- Board ---------- */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start"
      >
        {COLUMNS.map((col) => {
          const colTasks = activeTasks.filter((t) => t.status === col.id);
          const statusMeta = TASK_STATUS_META[col.id];

          return (
            <motion.div
              key={col.id}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.97 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`glass-card p-4 min-h-[550px] flex flex-col gap-3 transition-colors ${draggedTaskId ? 'border-[var(--accent-color)]/40' : ''}`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${statusMeta.dot}`} />
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{col.title}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusMeta.badge}`}>
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => setQuickTaskModalOpen(true)}
                  className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Add card"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 space-y-3">
                {colTasks.length === 0 ? (
                  <div className="h-36 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-xs font-semibold text-slate-400">
                    Drop task here
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
                    const totalSubtasks = task.subtasks?.length || 0;
                    const subtaskPercent =
                      totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
                    const priority = PRIORITY_META[task.priority];

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        draggable
                        whileDrag={{ scale: 1.04, rotate: 1.5, zIndex: 50, boxShadow: '0 24px 48px -12px rgba(99,102,241,0.35)' }}
                        onDragStart={(e) =>
                          handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, task.id)
                        }
                        className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 cursor-grab active:cursor-grabbing hover:border-[var(--accent-color)]/40 shadow-sm hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-[var(--accent-color)] bg-[var(--accent-soft)] px-2.5 py-0.5 rounded-md truncate max-w-[50%]">
                            {task.category}
                          </span>
                          <span className={`font-extrabold px-2 py-0.5 rounded-md uppercase ${priority.badge}`}>
                            {priority.label}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                          {task.title}
                        </h4>

                        {totalSubtasks > 0 && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              <span>Subtasks</span>
                              <span>
                                {completedSubtasks}/{totalSubtasks} ({subtaskPercent}%)
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[var(--accent-color)] rounded-full transition-all duration-300"
                                style={{ width: `${subtaskPercent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[var(--accent-color)]" /> {task.dueDate}
                          </span>

                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => toggleTaskArchive(task.id)}
                              className="p-1 text-slate-400 hover:text-[var(--accent-color)] hover:bg-[var(--accent-soft)] rounded-lg transition-colors cursor-pointer"
                              title="Move to Vault"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>

                            {col.id !== 'completed' && (
                              <button
                                onClick={() => updateTaskStatus(task.id, NEXT_STATUS[col.id])}
                                className="p-1 text-[var(--accent-color)] hover:bg-[var(--accent-soft)] rounded-lg transition-colors flex items-center gap-1 text-[10px] font-extrabold cursor-pointer"
                                title="Advance to next column"
                              >
                                <span>Next</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};