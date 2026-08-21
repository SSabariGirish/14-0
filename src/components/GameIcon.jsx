import React from 'react';

export default function GameIcon({ size = 32, style, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      {...props}
    >
      {/* Deep Chalkboard Slate Canvas Backshield */}
      <rect width="24" height="24" rx="6" fill="#0F172A" />
      
      {/* Abstract Analytical Pitch Target Rings */}
      <circle cx="12" cy="12" r="9" stroke="#334155" strokeWidth="0.75" strokeDasharray="2 2" />
      
      {/* Minimalist Monochromatic Wickets */}
      <rect x="8.5" y="7.5" width="1.25" height="9" rx="0.5" fill="#9CA3AF" />
      <rect x="11.35" y="6.5" width="1.3" height="10" rx="0.5" fill="#E5E7EB" />
      <rect x="14.25" y="7.5" width="1.25" height="9" rx="0.5" fill="#9CA3AF" />
      
      {/* Premium Athletic Accent Seam / Tactical Arc */}
      <path
        d="M4.5 16.5C7.5 13.5 11.5 10.5 19.5 7.5"
        stroke="#F97316"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Dynamic Selector Focal Point Crosshair */}
      <circle cx="11.5" cy="11.5" r="1.25" fill="#F97316" />
    </svg>
  );
}