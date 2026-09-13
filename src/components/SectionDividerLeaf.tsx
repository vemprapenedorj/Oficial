import React from 'react';
import { MonsteraLeaf } from './MonsteraLeaf';

export interface SectionDividerLeafProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'right' | 'left';
  color?: string;
  opacity?: number;
  rotation?: number;
  size?: number;
  variant?: 'normal' | 'slow' | 'subtle';
}

export const SectionDividerLeaf = React.memo(function SectionDividerLeaf({
  position = 'top-right',
  color = '#2E6B34',
  opacity = 0.8,
  rotation,
  size = 140,
  variant = 'normal',
}: SectionDividerLeafProps) {
  const positionStyle: React.CSSProperties = position.startsWith('top')
    ? { top: 56 }
    : position.startsWith('bottom')
      ? { bottom: 56 }
      : { top: '50%', transform: 'translateY(-50%)' };

  if (position.endsWith('right')) {
    positionStyle.right = 'clamp(12px, 3vw, 56px)';
  } else {
    positionStyle.left = 'clamp(12px, 3vw, 56px)';
  }

  const defaultRotation = rotation ?? (position.endsWith('right') ? 25 : -25);

  return (
    <div
      aria-hidden="true"
      className="section-divider-leaf pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      <div className="pointer-events-none absolute" style={positionStyle}>
        <MonsteraLeaf
          color={color}
          size={size}
          rotation={defaultRotation}
          opacity={opacity}
          variant={variant}
        />
      </div>
    </div>
  );
});
