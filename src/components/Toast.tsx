import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TOAST_META: Record<string, { icon: React.ReactNode; classes: string }> = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    classes: 'border-emerald-500/20 border-l-emerald-500',
  },
  warning: {
    icon: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    classes: 'border-amber-500/20 border-l-amber-500',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    classes: 'border-rose-500/20 border-l-rose-500',
  },
  info: {
    icon: <Info className="w-5 h-5 text-[var(--accent-color)] shrink-0" />,
    classes: 'border-[var(--accent-color)]/20 border-l-[var(--accent-color)]',
  },
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const meta = TOAST_META[toast.type ?? 'success'];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white shadow-xl backdrop-blur-md border ${meta.classes}`}
            >
              {meta.icon}

              <span className="text-sm font-medium text-slate-100 flex-1">{toast.title}</span>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};