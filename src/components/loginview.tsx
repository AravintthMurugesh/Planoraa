import React, { useState } from 'react';
import { useApp } from '../context/appcontext.tsx';
import { isSupabaseConfigured } from '../supabase/supabase';
import {
  Mail,
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
      setError('Please enter your full name.');
      setIsLoading(false);
      return;
    }

    if (!email || !password) {
      setError('Please fill in both email and password.');
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
      setError('Please enter your email address in the field above first.');
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
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden">
      {/* Background ambient lighting blur circles */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <img
            src="/src/assets/images/planora_logo_1784957089188.jpg"
            alt="Planora Logo"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow-md border border-slate-200/80 dark:border-slate-800 shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight leading-tight">
              Planora
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">
              Your all-in-one planning workspace.
            </span>
          </div>
        </div>

        {/* Theme switcher */}
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-medium shadow-sm"
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

      {/* Main Content Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 my-auto">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Left Hero Brand Panel */}
          <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src="/src/assets/images/planora_logo_1784957089188.jpg"
                  alt="Planora Logo"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-contain bg-white p-1 shadow-lg shrink-0"
                />
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Planora</h2>
                  <p className="text-xs text-indigo-200/90 font-medium">Your all-in-one planning workspace.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-indigo-800/60 space-y-4">
                <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  Organize Everything Seamlessly
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2.5 text-indigo-100">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Interactive Todo & Task</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-indigo-100">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span>Smart Calendar & Schedule Planner</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-indigo-100">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span>Weekly Class & Work Timetable</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-indigo-100">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span>Rich Block Notes & Quick Capture</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-indigo-800/40 mt-8">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protected with Supabase Auth Security</span>
              </div>
            </div>
          </div>

          {/* Right Login Form */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Header inside Form */}
              <div className="text-left mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Planora Account
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isSignUp ? 'Create your Planora Account' : 'Welcome back'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {isSignUp
                    ? 'Join Planora to organize tasks, events, timetables, and notes.'
                    : 'Sign in to access your custom workspace.'}
                </p>
              </div>

              {/* Form Mode Selector */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    !isSignUp
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
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
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    isSignUp
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </div>
                    <button type="button" onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 font-bold">×</button>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                      <span>{successMessage}</span>
                    </div>
                    <button type="button" onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-200 font-bold">×</button>
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.morgan@planora.app"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
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
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Authenticating...</span>
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create Planora Account' : 'Sign In to Workspace'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Access Bar */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Or instant quick access
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('Alex Morgan', 'alex.morgan@planora.app')}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold text-center transition-colors truncate"
                  >
                    🚀 Product Designer Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('Guest Member', 'guest@planora.app')}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold text-center transition-colors truncate"
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
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-400 dark:text-slate-500 relative z-10">
        &copy; {new Date().getFullYear()} Planora &bull; Your all-in-one planning workspace. All rights reserved.
      </footer>
    </div>
  );
};
