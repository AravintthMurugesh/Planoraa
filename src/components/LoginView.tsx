import React, { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { useApp } from '../context/AppContext';
import AuroraBackground from './AuroraBackground';
import { isSupabaseConfigured } from '../supabase';
import { RevealText } from './RevealText';
import { cn } from '../lib/utils';
import {
  Lock,
  User,
  Mail,
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sun,
  Moon,
  AlertCircle,
  LogIn,
  UserPlus,
  Loader2,
  Compass,
  Check,
} from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

const FEATURES = [
  {
    no: '01',
    title: 'Tasks Matrix & Flow',
    desc: 'Four-quadrant focus, kanban flow.',
  },
  {
    no: '02',
    title: 'Calendar & Agenda',
    desc: 'Your days, laid out in advance.',
  },
  {
    no: '03',
    title: 'Rhythm Timetable',
    desc: 'Fixed blocks that protect deep work.',
  },
  {
    no: '04',
    title: 'Notes & Knowledge',
    desc: 'Modular blocks of memory, always near.',
  },
];

export const LoginView: React.FC<{ initialMode?: 'signin' | 'signup' | 'forgot' }> = ({
  initialMode,
}) => {
  const {
    login,
    settings,
    updateSettings,
    signupWithSupabase,
    loginWithSupabase,
    resetPasswordWithSupabase,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode ?? 'signin');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSignUp = mode === 'signup';
  const isForgot = mode === 'forgot';

  const switchMode = (next: 'signin' | 'signup' | 'forgot') => {
    setMode(next);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your username.');
      setIsLoading(false);
      return;
    }

    if (mode === 'signin' && !email) {
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
      const displayName = isSignUp ? name.trim() : (name.trim() || 'User');
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

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmed = forgotEmail.trim();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setSuccessMessage('Password reset instructions have been sent to your email.');
      return;
    }

    setIsLoading(true);
    try {
      const { error: resetError } = await resetPasswordWithSupabase(trimmed);
      if (resetError) {
        console.error('Password reset request failed:', resetError.message);
        setError(resetError.message || 'Could not send the reset link. Please try again.');
      } else {
        setSuccessMessage('Password reset instructions have been sent to your email.');
        setForgotEmail('');
      }
    } catch (err: any) {
      console.error('Password reset request error:', err);
      setError('Something went wrong while sending the reset link. Please try again.');
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

  // Mouse parallax on the brand panel
  const brandRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 55, damping: 18 });
  const smy = useSpring(my, { stiffness: 55, damping: 18 });
  const orbX = useTransform(smx, [-0.5, 0.5], [26, -26]);
  const orbY = useTransform(smy, [-0.5, 0.5], [20, -20]);
  const ringX = useTransform(smx, [-0.5, 0.5], [-16, 16]);
  const ringY = useTransform(smy, [-0.5, 0.5], [-12, 12]);

  const handleBrandMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = brandRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
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

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 glass-panel border border-slate-200/80 dark:border-white/10 rounded-[28px] shadow-2xl overflow-hidden elevate"
        >
          {/* ---------- Left Brand Panel ---------- */}
          <motion.div
            ref={brandRef}
            onMouseMove={handleBrandMove}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.65, ease: EASE }}
            className="relative md:col-span-5 flex flex-col justify-between overflow-hidden rounded-t-[28px] md:rounded-l-[28px] md:rounded-tr-none px-8 sm:px-9 py-9 text-white bg-[linear-gradient(165deg,#0C1122_0%,#191238_50%,#0B0E1C_100%)] min-h-[320px] md:min-h-0"
          >
            {/* Ghost monogram watermark — the quiet editorial mark */}
            <span className="absolute -top-8 -right-3 pointer-events-none select-none font-display italic text-[11rem] leading-none text-white/[0.05]">
              P
            </span>

            {/* Parallax orbs */}
            <motion.div
              style={{ x: orbX, y: orbY }}
              className="absolute -top-24 -right-20 w-80 h-80 rounded-full blur-[110px] pointer-events-none bg-[var(--accent-color)]/25"
            />
            <motion.div
              style={{ x: ringX, y: ringY }}
              className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full blur-[100px] pointer-events-none bg-purple-500/20"
            />
            <div className="absolute top-1/3 right-8 w-44 h-44 rounded-full border border-white/[0.07] animate-spin-slow pointer-events-none" style={{ animationDuration: '26s' }} />
            <div className="absolute top-1/3 right-8 w-44 h-44 rounded-full border border-dashed border-white/[0.05] animate-spin-slow pointer-events-none" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />

            <div className="relative z-10 flex flex-col gap-7">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
                  className="flex items-center gap-2.5"
                >
                  <span className="h-px w-7 bg-[var(--accent-color)]/70" />
                  <span className="eyebrow text-[9px] text-indigo-300/90 tracking-[0.3em]">
                    Planora
                  </span>
                </motion.div>

                <h2 className="mt-4 font-display font-semibold text-[25px] sm:text-[28px] leading-[1.18] tracking-tight">
                  <RevealText text="A workspace that feels" delay={0.6} />
                  <br />
                  <RevealText
                    text="like a focused mind."
                    delay={0.82}
                    className="italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-cyan-200"
                  />
                </h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.05, duration: 0.6 }}
                  className="mt-3 text-[12px] leading-relaxed text-slate-400 font-medium max-w-[26ch]"
                >
                  Tasks, calendar and notes — woven into one calm surface. No clutter,
                  just intent.
                </motion.p>
              </div>

              <div className="space-y-0 border-t border-white/10 pt-6">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.no}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 + i * 0.11, duration: 0.5, ease: EASE }}
                    className="group/f flex items-baseline gap-3.5 border-b border-white/[0.06] py-3 cursor-default"
                  >
                    <span className="font-mono text-[10px] font-medium text-indigo-300/60 transition-colors group-hover/f:text-indigo-300 tabular-nums">
                      {f.no}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-bold text-slate-100 tracking-tight">
                        {f.title}
                      </p>
                      <p className="text-[10.5px] text-slate-400/90 font-medium mt-0.5">
                        {f.desc}
                      </p>
                    </div>
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.11, duration: 0.4 }}
                      className="ml-auto text-indigo-300/50 transition-all group-hover/f:translate-x-0.5 group-hover/f:text-indigo-300"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="relative z-10 mt-8 flex items-center justify-between border-t border-white/10 pt-4"
            >
              <div className="flex items-center gap-2 text-[10.5px] text-slate-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Secured by Supabase Auth</span>
              </div>
              <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
                v2 · 2026
              </span>
            </motion.div>
          </motion.div>

          {/* ---------- Right Form ---------- */}
          <div className="md:col-span-7 relative p-7 sm:p-9 flex flex-col">

            <div className="relative flex-1 flex flex-col">
              <div className="text-left">
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45, duration: 0.5, ease: EASE }}
                  className="flex items-center gap-2.5"
                >
                  <span className="h-px w-8 bg-[var(--accent-color)]/60" />
                  <span className="eyebrow text-[9px] text-[var(--accent-color)] tracking-[0.28em]">
                    Workspace Access
                  </span>
                </motion.div>

                <h2 className="mt-3.5 font-display font-semibold text-[28px] sm:text-[32px] tracking-tight text-slate-900 dark:text-white">
                  <RevealText
                    text={
                      isForgot
                        ? 'Forgot your password?'
                        : isSignUp
                          ? 'Create your account'
                          : 'Welcome back'
                    }
                    delay={0.5}
                  />
                </h2>
                <p className="mt-2 text-[12px] font-medium text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                  {isForgot
                    ? "Enter your email and we'll send you instructions to reset your password."
                    : isSignUp
                      ? 'Begin with a pristine workspace — your intentions, uncluttered.'
                      : 'Sign in to continue shaping your day.'}
                </p>

                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="p-3 pl-3.5 rounded-xl border border-[var(--accent-soft)] bg-[var(--accent-soft)]/70 text-[var(--accent-color)] text-[11px] font-bold flex items-center gap-2.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        New accounts start with a clean slate — add your own data from scratch.
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Mode Toggle */}
              {!isForgot && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.62, duration: 0.45, ease: EASE }}
                  className="mt-6 grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10"
                >
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className={cn(
                      'relative py-2.5 text-xs font-extrabold rounded-[13px] transition-colors cursor-pointer flex items-center justify-center gap-1.5',
                      !isSignUp
                        ? 'text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    {!isSignUp && (
                      <motion.span
                        layoutId="login-mode-pill"
                        className="absolute inset-0 rounded-[13px] bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] shadow-lg shadow-[var(--accent-soft)]"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      />
                    )}
                    <LogIn className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className={cn(
                      'relative py-2.5 text-xs font-extrabold rounded-[13px] transition-colors cursor-pointer flex items-center justify-center gap-1.5',
                      isSignUp
                        ? 'text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    {isSignUp && (
                      <motion.span
                        layoutId="login-mode-pill"
                        className="absolute inset-0 rounded-[13px] bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] shadow-lg shadow-[var(--accent-soft)]"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      />
                    )}
                    <UserPlus className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">Sign Up</span>
                  </button>
                </motion.div>
              )}

              {/* Form */}
              <motion.form
                onSubmit={isForgot ? handleForgotSubmit : handleSubmit}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72, duration: 0.5, ease: EASE }}
                className="space-y-4.5 mt-6 flex-1"
              >
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>{error}</span>
                      </div>
                      <button type="button" onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600 font-bold cursor-pointer">×</button>
                    </motion.div>
                  )}

                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                        <span>{successMessage}</span>
                      </div>
                      <button type="button" onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-600 font-bold cursor-pointer">×</button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence initial={false}>
                  {isSignUp && (
                    <motion.div
                      key="username-field"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <label className="eyebrow block text-[9px] text-slate-500 dark:text-slate-400 mb-2 tracking-[0.2em]">
                        Username
                      </label>
                      <div className="field">
                        <User className="field-icon" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. alex.morgan"
                          className="field-input text-slate-900 dark:text-white"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isForgot ? (
                  <div>
                    <label className="eyebrow block text-[9px] text-slate-500 dark:text-slate-400 mb-2 tracking-[0.2em]">
                      Email
                    </label>
                    <div className="field">
                      <Mail className="field-icon" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="name@gmail.com"
                        autoComplete="email"
                        className="field-input text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="eyebrow block text-[9px] text-slate-500 dark:text-slate-400 mb-2 tracking-[0.2em]">
                        Email
                      </label>
                      <div className="field">
                        <User className="field-icon" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@gmail.com"
                          className="field-input text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="eyebrow text-[9px] text-slate-500 dark:text-slate-400 tracking-[0.2em]">
                          Password
                        </label>
                        {!isSignUp && (
                          <button
                            type="button"
                            onClick={() => switchMode('forgot')}
                            className="link-underline text-[11px] font-bold text-[var(--accent-color)] cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="field">
                        <Lock className="field-icon" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
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
                  </>
                )}

                {!isForgot && (
                  <div className="flex items-center justify-between mt-1">
                    <button
                      type="button"
                      onClick={() => setRememberMe(!rememberMe)}
                      className="flex items-center gap-2.5 cursor-pointer select-none group/rm"
                    >
                      <span
                        className={cn(
                          'w-[18px] h-[18px] rounded-md border flex items-center justify-center transition-all duration-300',
                          rememberMe
                            ? 'border-[var(--accent-color)] bg-[var(--accent-color)] shadow-sm shadow-[var(--accent-soft)]'
                            : 'border-slate-400/60 dark:border-slate-500 group-hover/rm:border-[var(--accent-color)]/60'
                        )}
                      >
                        <AnimatePresence>
                          {rememberMe && (
                            <motion.span
                              initial={{ scale: 0, rotate: -90, opacity: 0 }}
                              animate={{ scale: 1, rotate: 0, opacity: 1 }}
                              exit={{ scale: 0, rotate: 90, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                              className="flex"
                            >
                              <Check className="w-3 h-3 text-white stroke-[3.5]" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                        Remember me
                      </span>
                    </button>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  className="btn-luxe w-full h-12 group/submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isForgot ? 'Sending...' : 'Securing your session…'}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {isForgot
                          ? 'Send Reset Link'
                          : isSignUp
                            ? 'Create account'
                            : 'Sign in to workspace'}
                      </span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.1, ease: 'easeInOut' }}
                        className="flex group-hover/submit:translate-x-0.5"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    </>
                  )}
                </motion.button>

                {isForgot && (
                  <div className="flex flex-col items-center gap-2 pt-1">
                    {successMessage && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 text-center"
                      >
                        Check your inbox and spam folder.
                      </motion.p>
                    )}
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className="link-underline text-[11px] font-bold text-[var(--accent-color)] cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Sign In
                    </button>
                  </div>
                )}
              </motion.form>

              {/* Quick Access */}
              {!isForgot && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85, duration: 0.5, ease: EASE }}
                  className="mt-7"
                >
                  <div className="flex items-center gap-4">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300 dark:to-white/15" />
                    <span className="eyebrow text-[8.5px] text-slate-400 dark:text-slate-500 tracking-[0.24em]">
                      Or instant access
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300 dark:to-white/15" />
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 mt-4">
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('Guest Member', 'guest@planora.app')}
                      className="group/d p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800/70 hover:border-[var(--accent-color)]/35 text-left transition-all duration-300 cursor-pointer btn-press"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-gradient-to-br from-[var(--accent-soft)] to-transparent text-[var(--accent-color)] border border-[var(--accent-soft)]">
                          <Compass className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                          Guest Explorer
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover/d:text-[var(--accent-color)] opacity-0 group-hover/d:opacity-100 transition-all duration-300 ml-auto shrink-0" />
                      </div>
                      <p className="mt-1.5 text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 pl-0.5">
                        Wander an empty, fresh slate
                      </p>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
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