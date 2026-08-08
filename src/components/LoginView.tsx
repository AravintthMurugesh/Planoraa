import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
      login(email || 'user@planora.app', displayName);
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
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-[#0B1020] text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight leading-tight">
              Planora
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">
              Your all-in-one planning workspace.
            </span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-bold shadow-xs cursor-pointer"
        >
          {settings.theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 my-auto">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 glass-panel border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Left Brand Panel */}
          <div className="md:col-span-5 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-3xl pointer-events-none" />
            
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
                  <div className="flex items-center gap-3 text-indigo-100">
                    <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Interactive Tasks & Task Flow Board</span>
                  </div>

                  <div className="flex items-center gap-3 text-indigo-100">
                    <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span>Calendar & Agenda Schedule</span>
                  </div>

                  <div className="flex items-center gap-3 text-indigo-100">
                    <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span>Weekly Timetable Planner</span>
                  </div>

                  <div className="flex items-center gap-3 text-indigo-100">
                    <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span>Modular Block Notes & Knowledge Base</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-white/10 mt-8">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protected with Supabase Auth Security</span>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-left mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 inline-flex items-center gap-1">
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
                  <div className="mt-3 p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[11px] font-bold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
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
                  className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                    !isSignUp
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                    isSignUp
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign Up
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
                        className="w-full pl-10 pr-4 py-3 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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
                      className="w-full pl-10 pr-4 py-3 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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
                      className="w-full pl-10 pr-10 py-3 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Authenticating...</span>
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create Planora Account' : 'Sign In to Workspace'}</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
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

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs font-bold text-slate-400 dark:text-slate-500 relative z-10">
        &copy; {new Date().getFullYear()} Planora &bull; Your all-in-one planning workspace. All rights reserved.
      </footer>
    </div>
  );
};
