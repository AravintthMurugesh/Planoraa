import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckSquare,
  Square,
  Plus,
  Search,
  Flag,
  Calendar,
  Clock,
  Tag,
  Star,
  Trash2,
  Edit,
  ChevronRight,
  Paperclip,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/appcontext.tsx';
import { Task, Priority } from '../../types';

export const TodoListView: React.FC = () => {
  const {
    activeTasks,
    toggleTaskComplete,
    toggleTaskFavorite,
    deleteTask,
    updateTask,
    setQuickTaskModalOpen,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'high'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter tasks
  const filteredTasks = activeTasks.filter((task) => {
    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchCat = task.category.toLowerCase().includes(q);
      const matchTag = task.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCat && !matchTag) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }

    // Tab Filter
    if (activeFilter === 'today') {
      return task.dueDate === todayStr;
    }
    if (activeFilter === 'upcoming') {
      return task.dueDate > todayStr && task.status !== 'completed';
    }
    if (activeFilter === 'completed') {
      return task.status === 'completed';
    }
    if (activeFilter === 'high') {
      return task.priority === 'high' && task.status !== 'completed';
    }

    return true;
  });

  const categories = Array.from(new Set(activeTasks.map((t) => t.category)));

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Todo List</h1>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
            Organize, prioritize, and accomplish your key deliverables.
          </p>
        </div>

        <button
          onClick={() => setQuickTaskModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> Add New Task
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-[20px] p-4 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Main Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'today', label: 'Today' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'high', label: 'High Priority' },
              { id: 'completed', label: 'Completed' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[#4F46E5] text-white shadow-sm'
                    : 'text-slate-300 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks or tags..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="pt-2 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-300 font-semibold shrink-0">Category:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700/50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List Container */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#0F172A] border border-slate-800 rounded-[20px] p-12 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center mx-auto mb-3 border border-indigo-800/50">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="font-bold text-white text-base">No tasks found</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting filters or add a new task.</p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => {
              const isCompleted = task.status === 'completed';
              const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
              const totalSubtasks = task.subtasks?.length || 0;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-[#0F172A] border border-slate-800 rounded-[20px] p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-indigo-500/60 shadow-xl transition-all ${
                    isCompleted ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Toggle Complete Checkbox */}
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors shrink-0 cursor-pointer"
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <div
                      onClick={() => setSelectedTaskDetail(task)}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`font-bold text-base text-white ${
                            isCompleted ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </h4>

                        {/* Priority Badge */}
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase border ${
                            task.priority === 'high'
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                              : task.priority === 'medium'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {task.priority}
                        </span>

                        {/* Category Pill */}
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                          {task.category}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs font-normal text-slate-300 mt-1.5 line-clamp-1">
                          {task.description}
                        </p>
                      )}

                      {/* Task Sub-metadata */}
                      <div className="flex items-center gap-3 mt-3 text-[11px] font-medium text-slate-300 flex-wrap">
                        <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-lg text-white">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {task.dueDate}
                        </span>
                        {task.dueTime && (
                          <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-lg text-white">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> {task.dueTime}
                          </span>
                        )}
                        {totalSubtasks > 0 && (
                          <span className="flex items-center gap-1.5 text-indigo-300 font-bold bg-indigo-950/90 border border-indigo-800/80 px-2.5 py-1 rounded-lg">
                            <CheckSquare className="w-3.5 h-3.5 text-indigo-400" /> {completedSubtasks}/{totalSubtasks} subtasks
                          </span>
                        )}
                        {task.attachments && task.attachments.length > 0 && (
                          <span className="flex items-center gap-1.5 text-white bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-lg">
                            <Paperclip className="w-3.5 h-3.5 text-slate-400" /> {task.attachments.length} files
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => toggleTaskFavorite(task.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        task.isFavorite
                          ? 'text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                      title="Favorite"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>

                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      title="Edit Task"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Detail Drawer Modal */}
      {selectedTaskDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md h-full bg-[#0F172A] border-l border-slate-800 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Task Overview
                </span>
                <button
                  onClick={() => setSelectedTaskDetail(null)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{selectedTaskDetail.title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedTaskDetail.description || 'No detailed description provided.'}
                </p>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Due Date</span>
                  <span className="font-bold text-white">{selectedTaskDetail.dueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Priority</span>
                  <span className="font-bold text-white capitalize">{selectedTaskDetail.priority}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Category</span>
                  <span className="font-bold text-white">{selectedTaskDetail.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Status</span>
                  <span className="font-bold text-white capitalize">{selectedTaskDetail.status.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Subtasks */}
              {selectedTaskDetail.subtasks && selectedTaskDetail.subtasks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Checklist</h4>
                  <div className="space-y-2">
                    {selectedTaskDetail.subtasks.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => {
                          const updatedSub = selectedTaskDetail.subtasks?.map((s) =>
                            s.id === st.id ? { ...s, completed: !s.completed } : s
                          );
                          updateTask(selectedTaskDetail.id, { subtasks: updatedSub });
                          setSelectedTaskDetail({ ...selectedTaskDetail, subtasks: updatedSub });
                        }}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs cursor-pointer hover:bg-slate-800/80"
                      >
                        <input type="checkbox" checked={st.completed} readOnly className="rounded text-indigo-500" />
                        <span className={st.completed ? 'line-through text-slate-500' : 'text-white font-medium'}>
                          {st.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedTaskDetail(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Edit Task</h3>
              <button onClick={() => setEditingTask(null)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-medium text-white placeholder-slate-400"
            />

            <textarea
              rows={3}
              value={editingTask.description || ''}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400"
            />

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Priority</label>
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as Priority })}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Category</label>
                <input
                  type="text"
                  value={editingTask.category}
                  onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateTask(editingTask.id, editingTask);
                  setEditingTask(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
