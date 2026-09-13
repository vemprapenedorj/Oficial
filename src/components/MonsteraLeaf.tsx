import React from 'react';

export interface MonsteraLeafProps {
  color?: string;
  size?: number;
  rotation?: number;
  opacity?: number;
  variant?: 'normal' | 'slow' | 'subtle';
  className?: string;
  style?: React.CSSProperties;
}

type LeafStyle = React.CSSProperties & {
  '--leaf-size': string;
  '--leaf-rotation': string;
};

export const MonsteraLeaf = React.memo(function MonsteraLeaf({
  color = '#2E6B34',
  size = 120,
  rotation = 0,
  opacity = 0.8,
  variant = 'normal',
  className = '',
  style,
}: MonsteraLeafProps) {
  const variantClass = variant === 'slow'
    ? 'monstera-leaf--slow'
    : variant === 'subtle'
      ? 'monstera-leaf--subtle'
      : '';

  const leafStyle: LeafStyle = {
    ...style,
    '--leaf-size': `${size}px`,
    '--leaf-rotation': `${rotation}deg`,
    opacity,
    pointerEvents: 'none',
    userSelect: 'none',
  };

  return (
    <div
      aria-hidden="true"
      className={`monstera-leaf ${variantClass} ${className}`.trim()}
      style={leafStyle}
    >
      <svg
        viewBox="0 0 100 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        focusable="false"
        style={{ pointerEvents: 'none' }}
      >
        <path
          d="M 50 8 C 58 16, 67 22, 73 32 C 70 38, 77 46, 83 55 C 79 62, 85 72, 87 83 C 82 91, 86 102, 82 112 C 75 122, 67 133, 50 146 C 33 133, 25 122, 18 112 C 14 102, 18 91, 13 83 C 15 72, 21 62, 17 55 C 23 46, 30 38, 27 32 C 33 22, 42 16, 50 8 Z"
          fill={color}
          fillOpacity={0.95}
        />
        <path d="M 50 8 Q 50 75 50 146" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M 50 30 Q 62 26 72 32" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 50 48 Q 66 42 80 52" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 50 68 Q 68 62 84 76" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 50 88 Q 66 84 80 100" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 50 108 Q 62 106 72 120" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 50 30 Q 38 26 28 32" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 50 48 Q 34 42 20 52" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 50 68 Q 32 62 16 76" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 50 88 Q 34 84 20 100" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 50 108 Q 38 106 28 120" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      </svg>
    </div>
  );
});
