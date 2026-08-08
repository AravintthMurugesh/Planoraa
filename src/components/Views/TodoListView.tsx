import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
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
  Sparkles,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
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
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchCat = task.category.toLowerCase().includes(q);
      const matchTag = task.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCat && !matchTag) return false;
    }

    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }

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

  const handleTaskToggle = (id: string, isNowCompleted: boolean) => {
    toggleTaskComplete(id);
    if (!isNowCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const categories = Array.from(new Set(activeTasks.map((t) => t.category)));

  return (
    <div className="space-y-6 pb-12">
      {/* Header & New Task Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Task Workspace
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Organize, prioritize, and check off your daily deliverables.
          </p>
        </div>

        <button
          onClick={() => setQuickTaskModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Glassmorphism Filters Header Bar */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Filter Tabs */}
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks, categories..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center gap-2 overflow-x-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="text-slate-500 dark:text-slate-400 font-bold shrink-0">Category:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-3 border border-indigo-500/20">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="font-bold text-slate-900 dark:text-white text-base">No tasks match your search</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try adjusting filters or create a new task above.</p>
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
                  className={`glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-indigo-500/50 transition-all ${
                    isCompleted ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Toggle Button */}
                    <button
                      onClick={() => handleTaskToggle(task.id, isCompleted)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-500 transition-colors shrink-0 cursor-pointer"
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-emerald-500" />
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
                          className={`font-bold text-sm sm:text-base text-slate-900 dark:text-white ${
                            isCompleted ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </h4>

                        {/* Priority Pill */}
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                            task.priority === 'high'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                              : task.priority === 'medium'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                          }`}
                        >
                          {task.priority}
                        </span>

                        {/* Category Tag */}
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          {task.category}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {task.description}
                        </p>
                      )}

                      {/* Sub-meta */}
                      <div className="flex items-center gap-3 mt-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {task.dueDate}
                        </span>
                        {task.dueTime && (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" /> {task.dueTime}
                          </span>
                        )}
                        {totalSubtasks > 0 && (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                            <CheckSquare className="w-3.5 h-3.5" /> {completedSubtasks}/{totalSubtasks} subtasks
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => toggleTaskFavorite(task.id)}
                      className={`p-2 rounded-xl transition-all ${
                        task.isFavorite
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                      title="Favorite"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>

                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-2 text-slate-400 hover:text-indigo-500 rounded-xl hover:bg-indigo-500/10 transition-colors"
                      title="Edit Task"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors"
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

      {/* Task Detail Modal */}
      {selectedTaskDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="w-full max-w-md h-full glass-panel border-l border-slate-200 dark:border-white/10 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                  Task Specification
                </span>
                <button
                  onClick={() => setSelectedTaskDetail(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedTaskDetail.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {selectedTaskDetail.description || 'No additional notes provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Due Date</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedTaskDetail.dueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Priority</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize">{selectedTaskDetail.priority}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Category</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedTaskDetail.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Status</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize">{selectedTaskDetail.status.replace('_', ' ')}</span>
                </div>
              </div>

              {selectedTaskDetail.subtasks && selectedTaskDetail.subtasks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Checklist Items</h4>
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
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 text-xs cursor-pointer hover:border-indigo-500/40"
                      >
                        <input type="checkbox" checked={st.completed} readOnly className="rounded text-indigo-600" />
                        <span className={st.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white font-medium'}>
                          {st.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedTaskDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Edit Task</h3>
              <button onClick={() => setEditingTask(null)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />

            <textarea
              rows={3}
              value={editingTask.description || ''}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Priority</label>
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as Priority })}
                  className="w-full p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Category</label>
                <input
                  type="text"
                  value={editingTask.category}
                  onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateTask(editingTask.id, editingTask);
                  setEditingTask(null);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
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
