import React, { useEffect, useState } from 'react';
import { listFiles } from '../../api/client';
import FileCard from './FileCard';

/**
 * PUBLIC_INTERFACE
 * FileList with search/filter; notifies parent on selection.
 */
export default function FileList({ onView, onPreview, onEdit, onDelete, refreshKey }) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setBusy(true); setError('');
    try {
      const res = await listFiles({ q, status });
      setItems(res.items || []);
    } catch (e) {
      setError(e.message || 'Failed to load files');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [refreshKey]);

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="card" style={{ padding: 12 }}>
        <div className="grid grid-3" style={{ alignItems: 'end' }}>
          <div>
            <label className="label" htmlFor="q">Search</label>
            <input id="q" className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="Title or description" />
          </div>
          <div>
            <label className="label" htmlFor="status">Status</label>
            <select id="status" className="select" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">Any</option>
              <option value="ready">Ready</option>
              <option value="processing">Processing</option>
              <option value="error">Error</option>
            </select>
          </div>
          <div>
            <button className="btn btn-primary" onClick={load} disabled={busy} aria-busy={busy}>
              {busy ? 'Loading...' : 'Apply'}
            </button>
          </div>
        </div>
      </div>
      {error ? <div role="alert" className="card" style={{ padding: 12, color: 'var(--error)', fontWeight: 700 }}>{error}</div> : null}
      <div className="grid grid-3">
        {items.map((f) => (
          <FileCard
            key={f.id}
            file={f}
            onView={onView}
            onPreview={onPreview}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
