import confetti from 'canvas-confetti';
import type { Variants } from 'motion/react';

export const spring = { type: 'spring', stiffness: 420, damping: 34 } as const;
export const springSoft = { type: 'spring', stiffness: 240, damping: 28, mass: 0.9 } as const;
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeOutBack = [0.34, 1.56, 0.64, 1] as const;

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export function celebrateCompletion(baseX = 0) {
  const colors = ['#818CF8', '#A78BFA', '#34D399', '#FBBF24', '#22D3EE'];
  confetti({
    particleCount: 70,
    spread: 75,
    angle: 90,
    origin: { x: 0.5 + baseX, y: 0.75 },
    colors,
    ticks: 180,
    gravity: 0.9,
    scalar: 0.95,
    startVelocity: 42,
  });
  confetti({
    particleCount: 26,
    spread: 120,
    startVelocity: 28,
    decay: 0.92,
    origin: { x: 0.5 + baseX, y: 0.75 },
    colors,
  });
  void setTimeout(() => {
    confetti({
      particleCount: 22,
      spread: 100,
      angle: 60,
      origin: { x: 0.12 + baseX, y: 0.72 },
      colors: ['#818CF8', '#22D3EE'],
      ticks: 140,
    });
    confetti({
      particleCount: 22,
      spread: 100,
      angle: 120,
      origin: { x: 0.88 + baseX, y: 0.72 },
      colors: ['#A78BFA', '#34D399'],
      ticks: 140,
    });
  }, 180);
}