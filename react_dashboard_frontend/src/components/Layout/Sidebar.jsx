import React from 'react';
import { navigate, getHashPath } from '../../routes';

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation with active link highlighting.
 */
export default function Sidebar() {
  const path = getHashPath();

  const Link = ({ to, children }) => (
    <button
      className={`nav-link ${path === to ? 'active' : ''}`}
      onClick={() => navigate(to)}
      aria-current={path === to ? 'page' : undefined}
      style={{ width: '100%', textAlign: 'left', background: 'transparent' }}
    >
      {children}
    </button>
  );

  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="brand" aria-label="OSN Content Dashboard">📺 OSN CMS</div>
      <nav className="grid" style={{ gap: 8 }}>
        <Link to="/dashboard">🏠 Dashboard</Link>
        <Link to="/uploads">⬆️ Uploads</Link>
        <Link to="/files">🗂️ Files</Link>
      </nav>
      <div style={{ marginTop: 24, fontSize: 12, color: 'var(--muted)' }}>
        <div className="badge">Environment: {process.env.REACT_APP_NODE_ENV || 'development'}</div>
      </div>
    </aside>
  );
}
