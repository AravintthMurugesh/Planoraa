import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronLeft, Delete, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { spring } from '../lib/animations';

interface VaultPinGateProps {
  mode: 'setup' | 'unlock';
  onSetPin?: (pin: string) => void;
  onUnlock?: (pin: string) => boolean;
  onReset?: () => void;
}

const numpadKeys: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export const VaultPinGate: React.FC<VaultPinGateProps> = ({ mode, onSetPin, onUnlock, onReset }) => {
  const isSetup = mode === 'setup';
  const [step, setStep] = useState<1 | 2>(1);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState(0);
  const [showPin, setShowPin] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = isSetup && step === 2 ? confirmPin : pin;

  useEffect(() => {
    inputRef.current?.focus();
  }, [step, errorKey]);

  const goToConfirm = () => {
    if (pin.length !== 4) return;
    setStep(2);
    setConfirmPin('');
    setError(null);
  };

  const handleConfirm = () => {
    if (confirmPin.length !== 4) return;
    if (confirmPin !== pin) {
      setConfirmPin('');
      setError('PINs do not match. Try again.');
      setErrorKey((k) => k + 1);
      return;
    }
    onSetPin?.(confirmPin);
  };

  useEffect(() => {
    if (isSetup || pin.length !== 4) return;
    const ok = onUnlock?.(pin) ?? false;
    if (!ok) {
      setPin('');
      setError('Incorrect PIN. Try again.');
      setErrorKey((k) => k + 1);
    }
  }, [isSetup, onUnlock, pin]);

  const setCurrent = (value: string) => {
    setError(null);
    if (isSetup && step === 2) setConfirmPin(value);
    else setPin(value);
  };

  const appendDigit = (digit: string) => {
    if (current.length >= 4) return;
    setCurrent(current + digit);
    inputRef.current?.focus();
  };

  const handleBackspace = () => {
    if (current.length === 0) return;
    setError(null);
    setCurrent(current.slice(0, -1));
    inputRef.current?.focus();
  };

  const handleInputChange = (value: string) => {
    setCurrent(value.replace(/\D/g, '').slice(0, 4));
  };

  const goBackToEntry = () => {
    setStep(1);
    setConfirmPin('');
    setError(null);
  };

  const label = isSetup
    ? step === 1
      ? 'Create your vault PIN'
      : 'Confirm your vault PIN'
    : 'Vault locked';
  const subtitle = isSetup
    ? step === 1
      ? 'Pick a 4-digit PIN you will remember. You will need it to open your archive.'
      : 'Enter the same 4 digits once more to confirm.'
    : 'Enter your 4-digit PIN to open the archive.';

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center space-y-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isSetup ? `setup-${step}` : 'unlock'}
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center space-y-5"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-hover)] opacity-25 blur-lg" />
              <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-[var(--accent-soft)] to-slate-100/40 dark:to-slate-900/40 border border-[var(--accent-color)]/25 shadow-lg shadow-[var(--accent-soft)]/40">
                {isSetup ? (
                  <ShieldCheck className="w-6 h-6 text-[var(--accent-color)]" />
                ) : (
                  <Lock className="w-6 h-6 text-[var(--accent-color)]" />
                )}
              </div>
            </div>

            {isSetup && (
              <div className="w-full max-w-[240px] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase">
                    Step {step} of 2
                  </span>
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={goBackToEntry}
                      className="text-[10px] font-extrabold text-[var(--accent-color)] hover:opacity-80 flex items-center gap-0.5 cursor-pointer transition-opacity"
                    >
                      <ChevronLeft className="w-3 h-3 stroke-[3]" /> Edit PIN
                    </button>
                  )}
                </div>
                <div className="h-1.5 rounded-full bg-slate-200/80 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)]"
                    initial={false}
                    animate={{ width: step === 1 ? '50%' : '100%' }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{label}</h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="relative w-full max-w-[240px]">
              <motion.div
                key={errorKey}
                animate={error ? { x: [0, -9, 9, -6, 6, -3, 3, 0] } : { x: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="flex justify-center gap-3 py-1"
              >
                {[0, 1, 2, 3].map((i) => {
                  const filled = i < current.length;
                  return (
                    <motion.div
                      key={i}
                      animate={filled ? { scale: 1.06 } : { scale: 1 }}
                      transition={spring}
                      className={`w-11 h-14 rounded-2xl border-2 flex items-center justify-center transition-colors duration-200 ${
                        filled
                          ? 'border-[var(--accent-color)] bg-[var(--accent-soft)] shadow-md shadow-[var(--accent-soft)]/50'
                          : 'border-slate-300/70 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/60'
                      }`}
                    >
                      <AnimatePresence mode="popLayout">
                        {filled && (
                          <motion.span
                            key="fill"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={spring}
                            className={
                              showPin
                                ? 'text-xl font-black text-[var(--accent-color)] select-none'
                                : 'w-3 h-3 rounded-full bg-[var(--accent-color)]'
                            }
                          >
                            {showPin ? current[i] : ''}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>

              <input
                ref={inputRef}
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                autoFocus
                value={current}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace') {
                    e.preventDefault();
                    handleBackspace();
                  }
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (isSetup && step === 1) goToConfirm();
                    else if (isSetup && step === 2) handleConfirm();
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-default"
                aria-label="Vault PIN"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPin((v) => !v);
                  inputRef.current?.focus();
                }}
                title={showPin ? 'Hide PIN' : 'Show PIN'}
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                className="absolute -right-10 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-rose-500 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {error}
              </motion.p>
            )}

            <div className="w-full max-w-[260px] grid grid-cols-3 gap-2.5">
              {numpadKeys.map((key) => {
                if (key === '')
                  return <div key="spacer" className="h-12 sm:h-14" />;
                if (key === 'del')
                  return (
                    <button
                      key="del"
                      type="button"
                      onClick={handleBackspace}
                      aria-label="Delete last digit"
                      className="h-12 sm:h-14 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/10 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 active:scale-[0.93] transition-all duration-150 cursor-pointer btn-press"
                    >
                      <Delete className="w-5 h-5" />
                    </button>
                  );
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => appendDigit(key)}
                    className="h-12 sm:h-14 rounded-2xl text-lg font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/10 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/40 active:scale-[0.93] transition-all duration-150 cursor-pointer btn-press select-none"
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            {isSetup && step === 1 && (
              <motion.button
                type="button"
                onClick={goToConfirm}
                disabled={pin.length !== 4}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-[260px] py-3 rounded-2xl bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent-soft)] hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed btn-shine"
              >
                Next
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </motion.button>
            )}

            {isSetup && step === 2 && (
              <motion.button
                type="button"
                onClick={handleConfirm}
                disabled={confirmPin.length !== 4}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-[260px] py-3 rounded-2xl bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent-soft)] hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed btn-shine"
              >
                <ShieldCheck className="w-4 h-4 stroke-[3]" />
                Confirm PIN
              </motion.button>
            )}

            {!isSetup && !showResetConfirm && (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer underline underline-offset-2"
              >
                Forgot PIN?
              </button>
            )}

            {!isSetup && showResetConfirm && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-[260px] p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2.5"
              >
                <p className="text-[11px] font-bold text-rose-500 leading-relaxed">
                  This clears your vault PIN. Your archived items stay saved, but the archive will be unprotected
                  until you set a new PIN.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onReset?.();
                      setShowResetConfirm(false);
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-rose-500 text-white text-[11px] font-extrabold hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    Yes, clear PIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-extrabold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export const VaultPinModal: React.FC<{ onSetPin: (pin: string) => void }> = ({ onSetPin }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={spring}
        className="glass-card p-8 w-full max-w-sm border border-slate-200/80 dark:border-white/10"
      >
        <VaultPinGate mode="setup" onSetPin={onSetPin} />
      </motion.div>
    </div>
  );
};