import React, { useState } from 'react';
import FileList from '../components/Files/FileList';
import FileDetailsModal from '../components/Files/FileDetailsModal';
import { getPreviewUrl, deleteFile, updateFile } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Files page: search, filter, details, preview, edit, delete.
 */
export default function Files() {
  const [sel, setSel] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <section className="section">
        <h2>Files</h2>
        <FileList
          refreshKey={refreshKey}
          onView={setSel}
          onPreview={(f) => window.open(getPreviewUrl(f.id), '_blank')}
          onEdit={async (f) => {
            const title = prompt('New title', f.title);
            if (!title || title === f.title) return;
            await updateFile(f.id, { title });
            setRefreshKey(k => k + 1);
          }}
          onDelete={async (f) => {
            if (!window.confirm(`Delete "${f.title}"? This cannot be undone.`)) return;
            await deleteFile(f.id);
            setRefreshKey(k => k + 1);
          }}
        />
      </section>
      <FileDetailsModal file={sel} onClose={() => setSel(null)} />
    </div>
  );
}
