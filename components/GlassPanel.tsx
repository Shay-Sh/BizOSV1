'use client';

import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children,
  className = '', 
}) => {
  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl ${className}`}>
      {children}
    </div>
  );
}; 