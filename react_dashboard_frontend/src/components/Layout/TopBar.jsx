import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TopBar with title and theme toggle
 */
export default function TopBar({ theme, onToggleTheme }) {
  return (
    <header className="topbar" role="banner">
      <div className="title">OSN Content Management</div>
      <div>
        <button className="btn btn-secondary" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  );
}
