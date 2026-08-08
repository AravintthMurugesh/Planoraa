import React from 'react';
import { Archive, RotateCcw, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ArchiveView: React.FC = () => {
  const { tasks, toggleTaskArchive, deleteTask } = useApp();

  const archivedTasks = tasks.filter((t) => t.isArchived);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Archive className="w-7 h-7 text-indigo-500" />
          <span>Archive Repository</span>
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          Safely stored items that are finished or put on hold.
        </p>
      </div>

      <div className="glass-card p-6 space-y-3">
        {archivedTasks.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-12 font-medium">No archived items in storage.</p>
        ) : (
          archivedTasks.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.category} • Archived</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleTaskArchive(t.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-500/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restore
                </button>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Permanently Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
