import React from 'react';
import { motion } from 'motion/react';
import { Star, CheckSquare, FileText, Archive } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FavoritesView: React.FC = () => {
  const {
    activeTasks,
    notes,
    toggleTaskFavorite,
    toggleNoteFavorite,
    toggleTaskArchive,
    toggleNoteArchive,
    setActiveTab,
  } = useApp();

  const favoriteTasks = activeTasks.filter((t) => t.isFavorite);
  const favoriteNotes = notes.filter((n) => n.isFavorite);

  return (
    <div className="space-y-6 pb-12 animate-fade-up">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
          <span>Starred Favorites</span>
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          Quick-access repository for starred tasks and essential notes.
        </p>
      </div>

      <div className="space-y-6">
        {/* Favorited tasks */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Starred Tasks ({favoriteTasks.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteTasks.length === 0 ? (
              <div className="glass-card p-8 text-center text-xs text-slate-400 md:col-span-2">
                No starred tasks yet. Click the star icon on any task to add it here.
              </div>
            ) : (
              favoriteTasks.map((t) => (
                <motion.div
                  key={t.id}
                  whileHover={{ y: -2 }}
                  onClick={() => setActiveTab('todo')}
                  className="glass-card p-4 flex items-center justify-between cursor-pointer card-lift group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        {t.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {t.category} • Due {t.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskFavorite(t.id);
                      }}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      title="Unstar"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskArchive(t.id);
                      }}
                      className="p-1 text-slate-400 hover:text-[var(--accent-color)] hover:bg-[var(--accent-soft)] rounded-lg transition-all cursor-pointer"
                      title="Move to Vault"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Favorited notes */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Starred Notes ({favoriteNotes.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteNotes.length === 0 ? (
              <div className="glass-card p-8 text-center text-xs text-slate-400 md:col-span-2">
                No starred notes yet.
              </div>
            ) : (
              favoriteNotes.map((n) => (
                <motion.div
                  key={n.id}
                  whileHover={{ y: -2 }}
                  onClick={() => setActiveTab('notes')}
                  className="glass-card p-4 flex items-center justify-between cursor-pointer card-lift group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-color)] shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        {n.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {n.category} • {n.blocks.length} blocks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNoteFavorite(n.id);
                      }}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      title="Unstar"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNoteArchive(n.id);
                      }}
                      className="p-1 text-slate-400 hover:text-[var(--accent-color)] hover:bg-[var(--accent-soft)] rounded-lg transition-all cursor-pointer"
                      title="Move to Vault"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};