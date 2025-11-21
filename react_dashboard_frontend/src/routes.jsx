import React from 'react';
import Dashboard from './pages/Dashboard';
import Uploads from './pages/Uploads';
import Files from './pages/Files';

/**
 * PUBLIC_INTERFACE
 * Return current hash path normalized. Defaults to /dashboard
 */
export function getHashPath() {
  const raw = window.location.hash || '#/dashboard';
  const path = raw.startsWith('#') ? raw.slice(1) : raw;
  return path || '/dashboard';
}

/**
 * PUBLIC_INTERFACE
 * Push a path into hash history
 */
export function navigate(path) {
  window.location.hash = path;
}

/**
 * PUBLIC_INTERFACE
 * Routes component that renders based on hash path
 */
export default function Routes({ path }) {
  switch (path) {
    case '/dashboard':
      return <Dashboard />;
    case '/uploads':
      return <Uploads />;
    case '/files':
      return <Files />;
    default:
      return <Dashboard />;
  }
}
