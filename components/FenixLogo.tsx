'use client';

import React from 'react';

interface FenixLogoProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
  animate?: boolean;
}

export default function FenixLogo({
  size = 32,
  className = '',
  showGlow = true,
  animate = false,
}: FenixLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Flame Glow behind */}
      {showGlow && (
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 opacity-60 blur-md ${
            animate ? 'animate-pulse' : ''
          }`}
          style={{ transform: 'scale(0.85)' }}
        />
      )}

      {/* Primary Phoenix Visual Asset */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/fenix-logo.png"
        alt="Fénix Navegador Logo"
        width={size}
        height={size}
        className={`relative z-10 w-full h-full object-contain rounded-full ${
          animate ? 'hover:rotate-12 transition-transform duration-500' : ''
        }`}
        style={{
          filter: showGlow
            ? 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.75)) drop-shadow(0 0 12px rgba(245, 158, 11, 0.45))'
            : 'none',
        }}
        onError={(e) => {
          // Fallback if image path fails to load
          const target = e.currentTarget;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const fallback = parent.querySelector('.fenix-svg-fallback');
            if (fallback) {
              (fallback as HTMLElement).style.display = 'block';
            }
          }
        }}
      />

      {/* SVG Vector Fallback (Circular Fiery Phoenix) */}
      <svg
        className="fenix-svg-fallback hidden relative z-10 w-full h-full"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="46" fill="url(#fenix-bg-grad)" />
        <path
          d="M50 12C32 24 20 42 22 62C24 78 40 88 56 88C72 88 86 76 86 58C86 42 74 30 64 24C60 21 54 28 58 32C64 36 74 44 74 56C74 68 62 76 50 76C38 76 32 66 32 54C32 40 44 26 52 18C53 16 51 11 50 12Z"
          fill="url(#fenix-fire-grad)"
        />
        <path
          d="M48 24C40 32 36 44 38 54C40 62 48 68 56 68C64 68 70 62 68 52C66 42 56 32 50 28C48 26 47 23 48 24Z"
          fill="#FFE066"
        />
        <circle cx="53" cy="28" r="2.5" fill="#FFF" />
        <defs>
          <linearGradient id="fenix-bg-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#991B1B" stopOpacity="0.2" />
            <stop offset="1" stopColor="#D97706" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="fenix-fire-grad" x1="20" y1="12" x2="86" y2="88" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EF4444" />
            <stop offset="0.5" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#FCD34D" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
