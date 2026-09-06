import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = '', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Outer rounded container */}
      <rect width="128" height="128" rx="36" fill="#00434c" />
      
      {/* Dashed outer circular contour */}
      <circle
        cx="64"
        cy="64"
        r="48"
        stroke="#22a392"
        strokeWidth="2.5"
        strokeDasharray="6 6"
        opacity="0.65"
      />
      
      {/* Teardrop / Leaf body */}
      <path
        d="M64 18 C78 38 92 60 92 78 C92 93.46 79.46 106 64 106 C48.54 106 36 93.46 36 78 C36 60 50 38 64 18 Z"
        fill="#12b388"
      />
      
      {/* Inner droplet cutout */}
      <path
        d="M64 34 C73 49 82 66 82 78 C82 87.94 73.94 96 64 96 C54.06 96 46 87.94 46 78 C46 66 55 49 64 34 Z"
        fill="#00434c"
      />
      
      {/* Central Medical Cross */}
      <rect x="58" y="52" width="12" height="32" rx="4" fill="#ffffff" />
      <rect x="48" y="62" width="32" height="12" rx="4" fill="#ffffff" />
      
      {/* Connected Nodes Baseline (ECG / Network metaphor) */}
      <path
        d="M40 98 Q64 108 88 98"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="41" cy="98" r="4.5" fill="#32e5ad" />
      <circle cx="64" cy="103" r="5" fill="#ffffff" />
      <circle cx="87" cy="98" r="4.5" fill="#32e5ad" />
    </svg>
  );
};
