import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Small badge with color variants
 */
export default function Badge({ children, color = 'gray', title }) {
  const backgrounds = {
    blue: 'rgba(37,99,235,.12)',
    amber: 'rgba(245,158,11,.15)',
    red: 'rgba(239,68,68,.15)',
    gray: '#f3f4f6',
    green: 'rgba(16,185,129,.15)'
  };
  const fg = {
    blue: '#1D4ED8',
    amber: '#92400E',
    red: '#991B1B',
    gray: '#111827',
    green: '#065F46'
  };
  return (
    <span className="badge" title={title} style={{ background: backgrounds[color] || backgrounds.gray, color: fg[color] || fg.gray }}>
      {children}
    </span>
  );
}
