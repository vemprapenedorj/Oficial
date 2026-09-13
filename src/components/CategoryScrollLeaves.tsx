import React from 'react';
import { MonsteraLeaf } from './MonsteraLeaf';

export interface CategoryScrollLeavesProps {
  itemCount: number;
}

const leafConfigs = [
  { top: '6%', side: 'right', color: '#2E6B34', size: 90, opacity: 0.8, rotation: 25, variant: 'subtle' },
  { top: '30%', side: 'left', color: '#174C35', size: 85, opacity: 0.7, rotation: -25, variant: 'slow' },
  { top: '56%', side: 'right', color: '#6F9568', size: 90, opacity: 0.8, rotation: 20, variant: 'normal' },
  { top: '80%', side: 'left', color: '#2E6B34', size: 85, opacity: 0.7, rotation: -20, variant: 'subtle' },
] as const;

export const CategoryScrollLeaves = React.memo(function CategoryScrollLeaves({
  itemCount,
}: CategoryScrollLeavesProps) {
  if (itemCount === 0) return null;

  const activeCount = itemCount <= 4 ? 1 : itemCount <= 8 ? 2 : itemCount <= 12 ? 3 : 4;

  return (
    <div
      aria-hidden="true"
      className="category-leaf-wrapper pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {leafConfigs.slice(0, activeCount).map((leaf, index) => (
        <div
          key={`${leaf.side}-${leaf.top}`}
          className={`category-leaf ${leaf.side === 'right' ? 'category-leaf--right' : 'category-leaf--left'}`}
          style={{ top: leaf.top }}
        >
          <MonsteraLeaf
            color={leaf.color}
            size={leaf.size}
            opacity={leaf.opacity}
            rotation={leaf.rotation}
            variant={leaf.variant}
          />
        </div>
      ))}
    </div>
  );
});
