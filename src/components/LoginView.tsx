import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import AuroraBackground from './AuroraBackground';
import { isSupabaseConfigured } from '../supabase';
import {
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  FileText,
  ShieldCheck,
  Sun,
  Moon,
  AlertCircle,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const {
    login,
    settings,
    updateSettings,
    signupWithSupabase,
    loginWithSupabase,
    resetPasswordWithSupabase,
  } = useApp();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (isSignUp && !name.trim()) {
      setError('Please enter your username.');
      setIsLoading(false);
      return;
    }

    if (!isSignUp && !email) {
      setError('Please enter your email.');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      setIsLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      const displayName = isSignUp ? name.trim() : (name.trim() || 'Alex Morgan');
      login(email || 'user@planora.app', displayName, isSignUp);
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await signupWithSupabase(email, password, name.trim());
        if (signUpError) {
          setError(signUpError.message);
        } else if (data?.session) {
          setSuccessMessage('Account created and signed in successfully!');
        } else {
          setSuccessMessage('Sign up successful! Please check your email for a confirmation link.');
        }
      } else {
        const { error: signInError } = await loginWithSupabase(email, password);
        if (signInError) {
          setError(signInError.message);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setSuccessMessage(null);
    if (!email) {
      setError('Please enter your email in the field above first.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setSuccessMessage(`Password reset link simulated for ${email}. Check your email inbox.`);
      return;
    }

    setIsLoading(true);
    try {
      const { error: resetError } = await resetPasswordWithSupabase(email);
      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccessMessage(`Password reset link sent to ${email}. Check your email inbox.`);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoName: string, demoEmail: string) => {
    setError(null);
    setSuccessMessage(null);
    login(demoEmail, demoName);
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
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-10"
      >
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--accent-color)] to-[var(--accent-hover)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent-soft)] animate-float"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight leading-tight">
              Planora
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">
              Your all-in-one planning workspace.
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

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 glass-panel border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          
          {/* Left Brand Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-8 text-white flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-3xl pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none bg-[var(--accent-color)]/25 animate-float-slow" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none bg-purple-500/20 animate-float" />
            
            <div className="relative z-10 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Planora</h2>
                <p className="text-xs text-indigo-200/90 font-medium">Your all-in-one planning workspace.</p>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4">
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Complete Productivity Suite
                </p>

                <div className="space-y-3 text-xs font-medium">
                  {[
                    { icon: CheckCircle2, text: 'Interactive Tasks & Task Flow Board' },
                    { icon: Calendar, text: 'Calendar & Agenda Schedule' },
                    { icon: Clock, text: 'Weekly Timetable Planner' },
                    { icon: FileText, text: 'Modular Block Notes & Knowledge Base' },
                  ].map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.12, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-3 text-indigo-100"
                      >
                        <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0 hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{f.text}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="relative z-10 pt-8 border-t border-white/10 mt-8"
            >
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protected with Supabase Auth Security</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Form */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-left mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[var(--accent-soft)] text-[var(--accent-color)] border border-[var(--accent-soft)] inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Planora Workspace
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isSignUp ? 'Create your Account' : 'Welcome back'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {isSignUp
                    ? 'Join Planora to create your fresh, custom workspace.'
                    : 'Sign in to access your personal workspace.'}
                </p>
                {isSignUp && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-soft)] text-[var(--accent-color)] text-[11px] font-bold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                    <span>New account signups start with a clean workspace so you can add your own data from scratch.</span>
                  </div>
                )}
              </div>

              {/* Mode Toggle */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-2xl mb-6 border border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`relative py-2 text-xs font-extrabold rounded-xl transition-colors cursor-pointer ${
                    !isSignUp ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {!isSignUp && (
                    <motion.span
                      layoutId="login-mode-pill"
                      className="absolute inset-0 rounded-xl bg-[var(--accent-color)] shadow-md shadow-[var(--accent-soft)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`relative py-2 text-xs font-extrabold rounded-xl transition-colors cursor-pointer ${
                    isSignUp ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isSignUp && (
                    <motion.span
                      layoutId="login-mode-pill"
                      className="absolute inset-0 rounded-xl bg-[var(--accent-color)] shadow-md shadow-[var(--accent-soft)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">Sign Up</span>
                </button>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </div>
                    <button type="button" onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600 font-bold cursor-pointer">×</button>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                      <span>{successMessage}</span>
                    </div>
                    <button type="button" onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-600 font-bold cursor-pointer">×</button>
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                      Username
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. alex.morgan"
                        className="w-full pl-10 pr-4 py-3 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50"
                      />
                    </div>
                  </div>
                )}

                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                      Email
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@gmail.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                      Password
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[var(--accent-color)] focus:ring-[var(--accent-color)] cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Remember me</span>
                  </label>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] hover:opacity-90 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[var(--accent-soft)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 btn-shine"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Authenticating...</span>
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create Planora Account' : 'Sign In to Workspace'}</span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
                        className="flex"
                      >
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </motion.span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Quick Demo Access */}
              <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-white/10">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Or instant quick access
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('Alex Morgan', 'alex.morgan@planora.app')}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold text-center transition-colors truncate cursor-pointer"
                  >
                    🚀 Product Designer Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('Guest Member', 'guest@planora.app')}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold text-center transition-colors truncate cursor-pointer"
                  >
                    👤 Guest Explorer
                  </button>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs font-bold text-slate-400 dark:text-slate-500 relative z-10">
        &copy; {new Date().getFullYear()} Planora &bull; Your all-in-one planning workspace. All rights reserved.
      </footer>
    </div>
  );
};
