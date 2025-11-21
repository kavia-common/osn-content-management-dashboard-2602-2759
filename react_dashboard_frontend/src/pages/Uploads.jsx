import React, { useState } from 'react';
import UploadForm from '../components/Upload/UploadForm';
import FileList from '../components/Files/FileList';
import FileDetailsModal from '../components/Files/FileDetailsModal';
import { getPreviewUrl, deleteFile, updateFile } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Uploads page combines upload form and listing for convenience.
 */
export default function Uploads() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [sel, setSel] = useState(null);

  const onCreated = () => setRefreshKey(k => k + 1);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <UploadForm onCreated={onCreated} />
      <section className="section">
        <h2>All files</h2>
        <FileList
          refreshKey={refreshKey}
          onView={setSel}
          onPreview={(f) => window.open(getPreviewUrl(f.id), '_blank')}
          onEdit={async (f) => {
            // For demo: edit title inline
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
