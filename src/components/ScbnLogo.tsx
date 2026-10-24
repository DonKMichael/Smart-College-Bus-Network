/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ScbnLogoProps {
  size?: number | string;
  className?: string;
  showGlow?: boolean;
}

export const ScbnLogo: React.FC<ScbnLogoProps> = ({
  size = 40,
  className = '',
  showGlow = true,
}) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      style={{ width: dimension, height: dimension }}
      className={`relative rounded-full shrink-0 select-none transition-transform duration-300 hover:scale-105 active:scale-95 ${
        showGlow
          ? 'shadow-[0_4px_16px_rgba(113,100,237,0.35)] dark:shadow-[0_4px_16px_rgba(6,182,212,0.3)]'
          : ''
      } ${className}`}
    >
      <img
        src="/scbn-logo.svg"
        alt="Smart College Bus Network (SCBN) Logo"
        className="w-full h-full object-contain rounded-full"
        draggable={false}
      />
    </div>
  );
};
