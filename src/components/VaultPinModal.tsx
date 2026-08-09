import React, { useEffect, useRef, useState } from 'react';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

interface VaultPinGateProps {
  mode: 'setup' | 'unlock';
  onSetPin?: (pin: string) => void;
  onUnlock?: (pin: string) => boolean;
  onReset?: () => void;
}

const PinDots: React.FC<{ length: number }> = ({ length }) => (
  <div className="flex justify-center gap-3" onClick={(e) => e.preventDefault()}>
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className={`w-11 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all ${
          i < length
            ? 'border-[var(--accent-color)] bg-[var(--accent-soft)] text-[var(--accent-color)]'
            : 'border-slate-300 dark:border-white/10 text-transparent'
        }`}
      >
        •
      </div>
    ))}
  </div>
);

export const VaultPinGate: React.FC<VaultPinGateProps> = ({ mode, onSetPin, onUnlock, onReset }) => {
  const isSetup = mode === 'setup';
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (pin.length !== 4) return;

    if (isSetup && step === 1) {
      setStep(2);
      setConfirmPin('');
      setError(null);
      return;
    }

    if (isSetup && step === 2) {
      if (pin !== confirmPin) {
        setError('PINs do not match. Try again.');
        setPin('');
        setConfirmPin('');
        setStep(1);
        return;
      }
      onSetPin?.(pin);
      return;
    }

    if (!isSetup) {
      const ok = onUnlock?.(pin);
      if (!ok) {
        setError('Incorrect PIN. Try again.');
        setPin('');
      }
    }
  }, [pin]);

  const handleChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (isSetup && step === 2) {
      setConfirmPin(digits);
    } else {
      setPin(digits);
    }
    setError(null);
  };

  const label = isSetup ? (step === 1 ? 'Set Your Vault PIN' : 'Confirm Your Vault PIN') : 'Vault Locked';
  const subtitle = isSetup
    ? step === 1
      ? 'Create a 4-digit PIN. This will be required to open your archive.'
      : 'Re-enter the same 4-digit PIN to confirm.'
    : 'Enter your 4-digit PIN to open the archive.';

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="p-3 rounded-2xl bg-[var(--accent-soft)] border border-[var(--accent-soft)]">
          {isSetup ? (
            <ShieldCheck className="w-6 h-6 text-[var(--accent-color)]" />
          ) : (
            <Lock className="w-6 h-6 text-[var(--accent-color)]" />
          )}
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{label}</h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="relative w-full max-w-[240px]">
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            value={step === 2 ? confirmPin : pin}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && step === 2 && confirmPin.length === 0) {
                setStep(1);
                setConfirmPin('');
                setError(null);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-default"
            aria-label="Vault PIN"
          />
          <div
            onClick={() => inputRef.current?.focus()}
            className={`py-5 px-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border ${
              error ? 'border-rose-500/50' : 'border-slate-200 dark:border-white/10'
            } cursor-pointer`}
          >
            <PinDots length={step === 2 ? confirmPin.length : pin.length} />
          </div>
        </div>

        {error && (
          <p className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {error}
          </p>
        )}

        {isSetup && step === 2 ? (
          <button
            type="button"
            onClick={() => {
              if (pin !== confirmPin) {
                setError('PINs do not match. Try again.');
                setPin('');
                setConfirmPin('');
                setStep(1);
                return;
              }
              onSetPin?.(pin);
            }}
            disabled={confirmPin.length !== 4}
            className="w-full max-w-[240px] py-3 px-4 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] hover:opacity-90 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[var(--accent-soft)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-4 h-4" /> Set Vault PIN
          </button>
        ) : (
          <button
            type="button"
            disabled={!isSetup && pin.length !== 4}
            onClick={() => {
              if (isSetup && pin.length === 4) {
                setStep(2);
                setPin('');
                setConfirmPin('');
                setError(null);
                return;
              }
            }}
            className="w-full max-w-[240px] py-3 px-4 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] hover:opacity-90 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[var(--accent-soft)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSetup ? 'Continue' : 'Unlock Vault'}
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
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
          <div className="w-full max-w-[240px] p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2.5">
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
          </div>
        )}
      </div>
    </div>
  );
};

export const VaultPinModal: React.FC<{ onSetPin: (pin: string) => void }> = ({ onSetPin }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="glass-card p-8 w-full max-w-sm border border-slate-200/80 dark:border-white/10">
        <VaultPinGate mode="setup" onSetPin={onSetPin} />
      </div>
    </div>
  );
};