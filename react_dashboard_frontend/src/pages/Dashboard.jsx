import React, { useEffect, useState } from 'react';
import { listFiles } from '../api/client';
import FileCard from '../components/Files/FileCard';
import FileDetailsModal from '../components/Files/FileDetailsModal';
import { getPreviewUrl } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Dashboard with summary stats and recent files list.
 */
export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [sel, setSel] = useState(null);

  async function load() {
    setBusy(true);
    const res = await listFiles();
    setItems(res.items || []);
    setBusy(false);
  }

  useEffect(() => { load(); }, []);

  const total = items.length;
  const ready = items.filter(i => i.status === 'ready').length;
  const processing = items.filter(i => i.status === 'processing').length;

  return (
    <div className="grid" style={{ gap: 16 }}>
      <section className="grid grid-3">
        <div className="card stat" style={{ padding: 16 }}>
          <div className="value">{busy ? '…' : total}</div>
          <div className="label">Total Files</div>
        </div>
        <div className="card stat" style={{ padding: 16 }}>
          <div className="value" style={{ color: 'green' }}>{busy ? '…' : ready}</div>
          <div className="label">Ready</div>
        </div>
        <div className="card stat" style={{ padding: 16 }}>
          <div className="value" style={{ color: 'var(--secondary)' }}>{busy ? '…' : processing}</div>
          <div className="label">Processing</div>
        </div>
      </section>

      <section className="section">
        <h2>Recent files</h2>
        <div className="grid grid-3">
          {items.slice(0, 6).map(f => (
            <FileCard
              key={f.id}
              file={f}
              onView={setSel}
              onPreview={(file) => window.open(getPreviewUrl(file.id), '_blank')}
              onEdit={() => setSel(f)}
              onDelete={() => {}}
            />
          ))}
        </div>
      </section>

      <FileDetailsModal file={sel} onClose={() => setSel(null)} />
    </div>
  );
}
