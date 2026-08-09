import React from 'react';

const STARS = [
  { top: '18%', left: '12%', size: 'w-[3px] h-[3px]', delay: '0s' },
  { top: '32%', left: '84%', size: 'w-[2px] h-[2px]', delay: '1.2s' },
  { top: '58%', left: '7%', size: 'w-[2px] h-[2px]', delay: '2.1s' },
  { top: '12%', left: '62%', size: 'w-[2.5px] h-[2.5px]', delay: '0.6s' },
  { top: '74%', left: '78%', size: 'w-[3px] h-[3px]', delay: '1.7s' },
  { top: '45%', left: '38%', size: 'w-[2px] h-[2px]', delay: '2.8s' },
  { top: '82%', left: '28%', size: 'w-[2px] h-[2px]', delay: '0.9s' },
  { top: '66%', left: '55%', size: 'w-[1.5px] h-[1.5px]', delay: '2.4s' },
];

const AuroraBackground: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
    {/* Top spotlight — keeps the header area alive */}
    <div className="absolute inset-x-0 top-0 h-[65vh] bg-spotlight" />

    {/* Accent dot grid — fades out toward the edges */}
    <div className="absolute inset-0 bg-dots mask-fade" />

    {/* Ambient aurora blobs */}
    <div
      className="absolute -top-44 -left-44 w-[680px] h-[680px] rounded-full blur-[150px] bg-[color-mix(in_srgb,var(--accent-color)_16%,transparent)] aurora-blob transition-colors duration-700"
      style={{ animationDelay: '0s', animationDuration: '20s' }}
    />
    <div
      className="absolute top-1/3 -right-44 w-[560px] h-[560px] rounded-full blur-[150px] bg-[color-mix(in_srgb,var(--accent-color)_13%,transparent)] aurora-blob transition-colors duration-700"
      style={{ animationDelay: '-7s', animationDuration: '24s' }}
    />
    <div
      className="absolute -bottom-48 left-1/3 w-[660px] h-[660px] rounded-full blur-[170px] bg-[color-mix(in_srgb,var(--accent-color)_10%,transparent)] aurora-blob transition-colors duration-700"
      style={{ animationDelay: '-14s', animationDuration: '26s' }}
    />
    <div
      className="absolute top-2/3 -left-32 w-[480px] h-[480px] rounded-full blur-[150px] bg-[color-mix(in_srgb,#8B5CF6_8%,transparent)] aurora-blob transition-colors duration-700"
      style={{ animationDelay: '-10s', animationDuration: '28s' }}
    />
    <div
      className="absolute -bottom-40 right-24 w-[420px] h-[420px] rounded-full blur-[150px] bg-[color-mix(in_srgb,#22D3EE_6%,transparent)] aurora-blob transition-colors duration-700"
      style={{ animationDelay: '-3s', animationDuration: '22s' }}
    />

    {/* Twinkling constellation — dark mode only */}
    <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700">
      {STARS.map((s, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-white/70 blur-[0.5px] ${s.size} aurora-twinkle`}
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        />
      ))}
    </div>

    {/* Vignette — focuses attention on the content column */}
    <div className="absolute inset-0 bg-vignette" />

    {/* Ultra-fine film grain over the whole viewport */}
    <div className="absolute inset-0 bg-noise" />
  </div>
);

export default AuroraBackground;
