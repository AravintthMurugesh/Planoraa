import React from 'react';
import { motion } from 'motion/react';
import { Archive, CheckSquare, Lock, RotateCcw, Trash2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VaultPinGate } from '../VaultPinModal';

export const ArchiveView: React.FC = () => {
  const {
    tasks,
    notes,
    toggleTaskArchive,
    toggleNoteArchive,
    deleteTask,
    deleteNote,
    setActiveTab,
    hasVaultPin,
    isVaultUnlocked,
    setVaultPin,
    unlockVault,
    resetVaultPin,
    lockVault,
  } = useApp();

  const archivedTasks = tasks.filter((t) => t.isArchived);
  const archivedNotes = notes.filter((n) => n.isArchived);
  const isEmpty = archivedTasks.length === 0 && archivedNotes.length === 0;

  const VaultGate = ({ children }: { children: React.ReactNode }) => (
    <div className="space-y-6 pb-12">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Archive className="w-7 h-7 text-[var(--accent-color)]" />
          <span>Archive Repository</span>
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          Protected storage for finished or on-hold tasks and notes.
        </p>
      </div>
      <div className="glass-card p-10 flex items-center justify-center">{children}</div>
    </div>
  );

  if (!hasVaultPin) {
    return (
      <VaultGate>
        <VaultPinGate mode="setup" onSetPin={setVaultPin} />
      </VaultGate>
    );
  }

  if (!isVaultUnlocked) {
    return (
      <VaultGate>
        <VaultPinGate mode="unlock" onUnlock={unlockVault} onReset={resetVaultPin} />
      </VaultGate>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Archive className="w-7 h-7 text-[var(--accent-color)]" />
            <span>Archive Repository</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Safely stored tasks and notes that are finished or put on hold.
          </p>
        </div>

        <button
          onClick={lockVault}
          className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/40 transition-colors text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer btn-press"
          title="Lock the vault"
        >
          <Lock className="w-3.5 h-3.5" /> Lock Vault
        </button>
      </div>

      <div className="space-y-6">
        {/* Archived tasks */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Archived Tasks ({archivedTasks.length})
          </h3>
          <div className="glass-card p-6 space-y-3">
            {archivedTasks.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8 font-medium">
                No archived tasks in storage.
              </p>
            ) : (
              archivedTasks.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        {t.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {t.category} • Archived
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleTaskArchive(t.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-color)] text-xs font-bold flex items-center gap-1.5 hover:opacity-85 transition-colors cursor-pointer btn-press"
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
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Archived notes */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Archived Notes ({archivedNotes.length})
          </h3>
          <div className="glass-card p-6 space-y-3">
            {archivedNotes.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8 font-medium">
                No archived notes in storage.
              </p>
            ) : (
              archivedNotes.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setActiveTab('notes')}
                  className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 flex items-center justify-between gap-4 cursor-pointer hover:border-[var(--accent-color)]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg shrink-0">{n.icon || '📝'}</span>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        {n.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {n.category} • Archived
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNoteArchive(n.id);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-color)] text-xs font-bold flex items-center gap-1.5 hover:opacity-85 transition-colors cursor-pointer btn-press"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(n.id);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Permanently Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {isEmpty && (
          <div className="glass-card p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7 text-[var(--accent-color)]" />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Vault is empty</p>
            <p className="text-xs text-slate-400">
              Archive tasks or notes to move them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};