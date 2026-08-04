import React from 'react';
import { motion } from 'motion/react';
import { Star, CheckSquare, FileText } from 'lucide-react';
import { useApp } from '../../context/appcontext.tsx';

export const FavoritesView: React.FC = () => {
  const { activeTasks, notes, toggleTaskFavorite, toggleNoteFavorite, setActiveTab } = useApp();

  const favoriteTasks = activeTasks.filter((t) => t.isFavorite);
  const favoriteNotes = notes.filter((n) => n.isFavorite);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-400 fill-current" />
          Starred Favorites
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Quick access repository for high-priority tasks and essential notes.
        </p>
      </div>

      <div className="space-y-6">
        {/* Favorited Tasks */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Favorited Tasks ({favoriteTasks.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {favoriteTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No favorited tasks yet.</p>
            ) : (
              favoriteTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTab('todo')}
                  className="glass-card p-4 flex items-center justify-between cursor-pointer hover:border-indigo-500/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.category} • Due {t.dueDate}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskFavorite(t.id);
                    }}
                    className="text-amber-400"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Favorited Notes */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Favorited Notes ({favoriteNotes.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {favoriteNotes.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No favorited notes yet.</p>
            ) : (
              favoriteNotes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setActiveTab('notes')}
                  className="glass-card p-4 flex items-center justify-between cursor-pointer hover:border-indigo-500/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{n.icon || '📝'}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{n.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNoteFavorite(n.id);
                    }}
                    className="text-amber-400"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
