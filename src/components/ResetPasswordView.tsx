import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import AuroraBackground from './AuroraBackground';
import { supabase } from '../supabase';
import {
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sun,
  Moon,
  AlertCircle,
  Loader2,
  ArrowRight,
  KeyRound,
  RefreshCw,
} from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

const MIN_PASSWORD_LENGTH = 8;

const isRecoverySessionError = (message: string): boolean => {
  const m = message.toLowerCase();
  return (
    m.includes('session missing') ||
    m.includes('session_expired') ||
    m.includes('session has expired') ||
    m.includes('expired') ||
    m.includes('invalid token') ||
    m.includes('invalid jwt') ||
    m.includes('invalid_claim') ||
    m.includes('unauthorized') ||
    m.includes('authentication')
  );
};

interface ResetPasswordViewProps {
  onRequestNewLink: () => void;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ onRequestNewLink }) => {
  const {
    settings,
    updateSettings,
    isRecoveryExpired,
    markRecoveryExpired,
    updatePasswordWithSupabase,
    completeRecovery,
    supabaseUser,
  } = useApp();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expired, setExpired] = useState<boolean>(isRecoveryExpired);

  // Safety net: if we land here without a valid recovery session,
  // fall back to the expired/invalid state instead of a dead form.
  useEffect(() => {
    let mounted = true;
    if (!isRecoveryExpired && !expired) {
      supabase.auth
        .getSession()
        .then(({ data }) => {
          if (mounted && !data.session) {
            setExpired(true);
            markRecoveryExpired();
          }
        })
        .catch(() => {
          if (mounted) {
            setExpired(true);
            markRecoveryExpired();
          }
        });
    }
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }
    if (!confirmPassword) {
      setError('Please confirm your new password.');
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const { error: updateError } = await updatePasswordWithSupabase(newPassword);
      if (updateError) {
        console.error('Password update failed:', updateError.message);
        if (isRecoverySessionError(updateError.message)) {
          setExpired(true);
          markRecoveryExpired();
        } else {
          setError('Could not update your password. Please try again.');
        }
        return;
      }
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password update error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#F8FAFC] dark:bg-[#070B15] text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden">
      <AuroraBackground />

      {/* Top Header Bar */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-10"
      >
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
            className="gradient-ring w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--accent-color)] to-[var(--accent-hover)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent-soft)] cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-2xl text-slate-900 dark:text-white tracking-tight leading-none">
              Planora
            </span>
            <span className="eyebrow text-[9px] text-slate-500 dark:text-slate-400 mt-1 tracking-[0.28em]">
              Workspace OS
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.06, rotate: -4 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleTheme}
          title="Toggle Theme"
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-bold shadow-xs cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={settings.theme}
              initial={{ rotate: -120, opacity: 0, scale: 0.4 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 120, opacity: 0, scale: 0.4 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
              className="flex items-center gap-2"
            >
              {settings.theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[var(--accent-color)]" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.header>

      {/* Main Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          className="w-full max-w-md"
        >
          <div className="glass-panel border border-slate-200/80 dark:border-white/10 rounded-[28px] shadow-2xl overflow-hidden elevate p-7 sm:p-9">
            {expired ? (
              /* ---------------- Expired / Invalid Link ---------------- */
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col items-center text-center gap-4"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center"
                >
                  <AlertCircle className="w-7 h-7 text-amber-500" />
                </motion.span>

                <div>
                  <h2 className="font-display font-semibold text-[22px] sm:text-[24px] tracking-tight text-slate-900 dark:text-white leading-snug">
                    This password reset link has expired or is no longer valid.
                  </h2>
                  <p className="mt-2 text-[12px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    Request a fresh link and try again within the allowed time.
                  </p>
                </div>

                <motion.button
                  type="button"
                  onClick={onRequestNewLink}
                  whileTap={{ scale: 0.98 }}
                  className="btn-luxe w-full h-12 mt-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Request a new reset link</span>
                </motion.button>
              </motion.div>
            ) : success ? (
              /* ---------------- Success ---------------- */
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col items-center text-center gap-4"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </motion.span>

                <div>
                  <h2 className="font-display font-semibold text-[22px] sm:text-[24px] tracking-tight text-slate-900 dark:text-white">
                    Password updated successfully.
                  </h2>
                  <p className="mt-2 text-[12px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    Your new password is active. Head back into your workspace.
                  </p>
                </div>

                <motion.button
                  type="button"
                  onClick={completeRecovery}
                  whileTap={{ scale: 0.98 }}
                  className="btn-luxe w-full h-12 mt-2 group/submit"
                >
                  <span>Continue to Planora</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ) : (
              /* ---------------- Reset Form ---------------- */
              <form onSubmit={handleSubmit} className="flex flex-col">
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                  className="flex items-center gap-2.5"
                >
                  <span className="h-px w-8 bg-[var(--accent-color)]/60" />
                  <span className="eyebrow text-[9px] text-[var(--accent-color)] tracking-[0.28em]">
                    Account Security
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38, duration: 0.5, ease: EASE }}
                  className="mt-3.5 font-display font-semibold text-[26px] sm:text-[30px] tracking-tight text-slate-900 dark:text-white"
                >
                  Reset your password
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="mt-2 text-[12px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed"
                >
                  Choose a new password for your Planora account.
                  {supabaseUser?.email && (
                    <span className="block mt-1 text-[var(--accent-color)] font-bold truncate">
                      {supabaseUser.email}
                    </span>
                  )}
                </motion.p>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center justify-between gap-2 mt-4"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>{error}</span>
                      </div>
                      <button type="button" onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600 font-bold cursor-pointer">×</button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4 mt-6">
                  <div>
                    <label className="eyebrow block text-[9px] text-slate-500 dark:text-slate-400 mb-2 tracking-[0.2em]">
                      New Password
                    </label>
                    <div className="field">
                      <KeyRound className="field-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="field-input text-slate-900 dark:text-white"
                        style={{ paddingRight: 42 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="field-action"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="eyebrow block text-[9px] text-slate-500 dark:text-slate-400 mb-2 tracking-[0.2em]">
                      Confirm Password
                    </label>
                    <div className="field">
                      <Lock className="field-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="field-input text-slate-900 dark:text-white"
                        style={{ paddingRight: 42 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="field-action"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">
                  Passwords must be at least {MIN_PASSWORD_LENGTH} characters.
                </p>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  className="btn-luxe w-full h-12 mt-5 group/submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-5 text-center text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Secured by Supabase Auth
          </motion.p>
        </motion.div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-[11px] font-bold text-slate-400 dark:text-slate-500 relative z-10 tracking-wide">
        <span className="opacity-80">© {new Date().getFullYear()} Planora</span>
        <span className="mx-2 opacity-40">·</span>
        <span className="font-display italic opacity-80">crafted for focus</span>
      </footer>
    </div>
  );
};
