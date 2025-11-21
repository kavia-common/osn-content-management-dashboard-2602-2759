import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import Routes from './routes';
import { getHashPath } from './routes';

/**
 * PUBLIC_INTERFACE
 * App root: Provides layout shell (sidebar + topbar), handles theme toggling and hash-based routing.
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [path, setPath] = useState(getHashPath());

  useEffect(() => {
    document.title = 'OSN Content Dashboard';
  }, []);

  // apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // hash router listener
  useEffect(() => {
    const onHashChange = () => setPath(getHashPath());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const onToggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const page = useMemo(() => <Routes path={path} />, [path]);

  return (
    <div className="app-shell" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ display: 'grid', gridTemplateRows: '64px 1fr', minHeight: '100vh', background: 'linear-gradient(180deg, rgba(37,99,235,.05), rgba(249,250,251,1))' }}>
        <TopBar theme={theme} onToggleTheme={onToggleTheme} />
        <main style={{ padding: 24 }}>
          <div className="container">
            {page}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
