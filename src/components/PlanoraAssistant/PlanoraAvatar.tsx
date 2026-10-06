import React, { useId } from 'react';

interface PlanoraAvatarProps {
  className?: string;
}

/**
 * Planora mascot — a minimal, friendly rounded-square bot face.
 * Uses the app's accent gradient and adapts to the active accent color.
 */
export const PlanoraAvatar: React.FC<PlanoraAvatarProps> = ({ className }) => {
  const rawId = useId();
  const gradId = `planora-grad-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const sheenId = `planora-sheen-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" style={{ stopColor: 'var(--accent-color)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--accent-hover)' }} />
        </linearGradient>
        <linearGradient id={sheenId} x1="12" y1="8" x2="34" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Face */}
      <rect x="3" y="3" width="42" height="42" rx="13" fill={`url(#${gradId})`} />
      {/* Soft top sheen */}
      <path d="M9 13.5A6.5 6.5 0 0 1 15.5 7h17a6.5 6.5 0 0 1 6.5 6.5v0a6.5 6.5 0 0 1-6.5 6.5h-17A6.5 6.5 0 0 1 9 13.5v0z" fill={`url(#${sheenId})`} />
      {/* Inner accent ring */}
      <rect x="6" y="6" width="36" height="36" rx="10.5" stroke="white" strokeOpacity="0.14" strokeWidth="1.5" />

      {/* Eyes (subtle blink animation) */}
      <g className="planora-eyes">
        <circle cx="17.5" cy="21.5" r="3.4" fill="white" />
        <circle cx="30.5" cy="21.5" r="3.4" fill="white" />
      </g>

      {/* Smile */}
      <path
        d="M17.5 28.5C19.8 31 23.2 31.8 25.9 30.6C27 30.1 28 29.4 28.8 28.5"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.95"
      />
    </svg>
  );
};
