import React, { useState } from 'react';
import { motion } from 'motion/react';
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
import { useApp } from '../../context/appcontext.tsx';
import { Task, TaskStatus } from '../../types';

export const TaskTrackerKanbanView: React.FC = () => {
  const {
    activeTasks,
    updateTaskStatus,
    setQuickTaskModalOpen,
    toggleTaskComplete,
  } = useApp();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Column definitions
  const columns: { id: TaskStatus; title: string; color: string; badgeColor: string }[] = [
    { id: 'todo', title: 'To Do', color: 'border-slate-300 dark:border-slate-700', badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
    { id: 'in_progress', title: 'In Progress', color: 'border-indigo-500', badgeColor: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400' },
    { id: 'review', title: 'Review', color: 'border-amber-500', badgeColor: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' },
    { id: 'completed', title: 'Completed', color: 'border-emerald-500', badgeColor: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' },
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
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Kanban className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Task Tracker
          </h1>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
            Drag and drop task cards to adjust progress status seamlessly.
          </p>
        </div>

        <button
          onClick={() => setQuickTaskModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> Add Card
        </button>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{completionRate}%</p>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Completion Rate</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{inProgressCount}</p>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">In Active Progress</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{reviewCount}</p>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Under Review</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{completedCount}</p>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Completed Cards</p>
          </div>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = activeTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="bg-slate-200/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-2xl p-3 min-h-[500px] flex flex-col gap-3 transition-colors shadow-2xs"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-300 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.id === 'todo' ? 'bg-slate-500' : col.id === 'in_progress' ? 'bg-indigo-600' : col.id === 'review' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{col.title}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => setQuickTaskModalOpen(true)}
                  className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
                  title="Add task to column"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Cards list */}
              <div className="flex-1 space-y-3">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Drop items here
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
                        className="bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-indigo-500 shadow-xs transition-all space-y-3"
                      >
                        {/* Header: Category & Priority */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-md">
                            {task.category}
                          </span>
                          <span
                            className={`font-bold px-2 py-0.5 rounded-md uppercase ${
                              task.priority === 'high'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                                : task.priority === 'medium'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                                : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                          {task.title}
                        </h4>

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {task.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Subtasks progress bar */}
                        {totalSubtasks > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                              <span>Checklist</span>
                              <span>{completedSubtasks}/{totalSubtasks} ({subtaskPercent}%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                                style={{ width: `${subtaskPercent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Footer info & quick column move */}
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" /> {task.dueDate}
                          </span>

                          {/* Quick move dropdown or button */}
                          <div className="flex items-center gap-1">
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
                                className="p-1 text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-0.5 text-[10px] font-bold cursor-pointer"
                                title="Move to next stage"
                              >
                                Move <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
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
