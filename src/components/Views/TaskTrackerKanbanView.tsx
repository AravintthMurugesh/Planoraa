import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Kanban,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Calendar,
  CheckSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus } from '../../types';

export const TaskTrackerKanbanView: React.FC = () => {
  const {
    activeTasks,
    updateTaskStatus,
    setQuickTaskModalOpen,
  } = useApp();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Column definitions
  const columns: { id: TaskStatus; title: string; badgeColor: string }[] = [
    { id: 'todo', title: 'To Do', badgeColor: 'bg-slate-500/15 text-slate-600 dark:text-slate-300' },
    { id: 'in_progress', title: 'In Progress', badgeColor: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' },
    { id: 'review', title: 'Under Review', badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
    { id: 'completed', title: 'Completed', badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  ];

  // Top Summary Calculations
  const totalCount = activeTasks.length;
  const completedCount = activeTasks.filter((t) => t.status === 'completed').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

  const inProgressCount = activeTasks.filter((t) => t.status === 'in_progress').length;
  const reviewCount = activeTasks.filter((t) => t.status === 'review').length;

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      updateTaskStatus(taskId, targetStatus);
      if (targetStatus === 'completed') {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      }
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Kanban className="w-7 h-7 text-indigo-500" />
            <span>Task Flow Board</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Visual pipeline — drag and drop tasks across execution stages.
          </p>
        </div>

        <button
          onClick={() => setQuickTaskModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Task Card</span>
        </button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{completionRate}%</p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Completion Rate</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{inProgressCount}</p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">In Active Progress</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{reviewCount}</p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Under Review</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{completedCount}</p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Completed Cards</p>
          </div>
        </div>
      </div>

      {/* Task Flow Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = activeTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="glass-card p-4 min-h-[550px] flex flex-col gap-3 transition-colors"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.id === 'todo' ? 'bg-slate-500' : col.id === 'in_progress' ? 'bg-indigo-500' : col.id === 'review' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{col.title}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
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

              {/* Cards List Area */}
              <div className="flex-1 space-y-3">
                {colTasks.length === 0 ? (
                  <div className="h-36 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-xs font-semibold text-slate-400">
                    Drop task here
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
                    const totalSubtasks = task.subtasks?.length || 0;
                    const subtaskPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        draggable
                        onDragStart={(e) => handleDragStart(e as any, task.id)}
                        className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 cursor-grab active:cursor-grabbing hover:border-indigo-500/50 shadow-sm hover:shadow-md transition-all space-y-3"
                      >
                        {/* Header Badge */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                            {task.category}
                          </span>
                          <span
                            className={`font-extrabold px-2 py-0.5 rounded-md uppercase border ${
                              task.priority === 'high'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                : task.priority === 'medium'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                          {task.title}
                        </h4>

                        {/* Checklist Bar */}
                        {totalSubtasks > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              <span>Subtasks</span>
                              <span>{completedSubtasks}/{totalSubtasks} ({subtaskPercent}%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                                style={{ width: `${subtaskPercent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="pt-2 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {task.dueDate}
                          </span>

                          {col.id !== 'completed' && (
                            <button
                              onClick={() => {
                                const nextCol: Record<TaskStatus, TaskStatus> = {
                                  todo: 'in_progress',
                                  in_progress: 'review',
                                  review: 'completed',
                                  completed: 'todo',
                                };
                                updateTaskStatus(task.id, nextCol[col.id]);
                              }}
                              className="p-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-extrabold cursor-pointer"
                              title="Advance to next column"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
