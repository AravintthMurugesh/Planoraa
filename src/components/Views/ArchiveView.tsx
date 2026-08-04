import React from 'react';
import { Archive, RotateCcw, Trash2 } from 'lucide-react';
import { useApp } from '../../context/appcontext.tsx';

export const ArchiveView: React.FC = () => {
  const { tasks, toggleTaskArchive, deleteTask } = useApp();

  const archivedTasks = tasks.filter((t) => t.isArchived);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Archive className="w-6 h-6 text-slate-500" />
          Archive
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Safely stored items that are completed or put on hold.
        </p>
      </div>

      <div className="glass-card p-6 space-y-3">
        {archivedTasks.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-8">No archived items found.</p>
        ) : (
          archivedTasks.map((t) => (
            <div
              key={t.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{t.category} • Archived</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleTaskArchive(t.id)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restore
                </button>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
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
