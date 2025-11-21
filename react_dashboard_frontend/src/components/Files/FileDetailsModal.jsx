import React, { useEffect, useRef } from 'react';
import Badge from '../Common/Badge';

/**
 * PUBLIC_INTERFACE
 * Accessible modal to display file details
 */
export default function FileDetailsModal({ file, onClose }) {
  const closeBtn = useRef(null);
  useEffect(() => { closeBtn.current?.focus(); }, []);

  function onBackdrop(e) {
    if (e.target.getAttribute('role') === 'dialog') onClose();
  }

  if (!file) return null;
  return (
    <div className="modal-backdrop" onClick={onBackdrop}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-modal-title"
        aria-describedby="file-modal-desc"
      >
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 id="file-modal-title" style={{ margin: 0 }}>File details</h3>
          <button ref={closeBtn} className="btn" onClick={onClose} aria-label="Close details">Close</button>
        </header>
        <div className="body">
          <p id="file-modal-desc" className="helper" style={{ marginTop: 0 }}>Inspect metadata for the selected asset.</p>
          <div className="grid grid-2">
            <div className="card" style={{ padding: 12 }}>
              <strong>Title</strong>
              <div>{file.title}</div>
              <hr className="divider" />
              <strong>Description</strong>
              <div className="helper">{file.description || '—'}</div>
              <hr className="divider" />
              <strong>Tags</strong>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(file.tags || []).map((t, i) => <Badge key={i} color="blue">#{t}</Badge>)}
              </div>
              <hr className="divider" />
              <strong>Status</strong>
              <div><Badge color={file.status === 'ready' ? 'green' : (file.status === 'error' ? 'red' : 'amber')}>{file.status}</Badge></div>
              <hr className="divider" />
              <strong>Created</strong>
              <div className="helper">{new Date(file.createdAt).toLocaleString()}</div>
            </div>
            <div className="card" style={{ padding: 12 }}>
              <strong>Video</strong>
              <div className="helper">
                {(file.video && (file.video.codec || file.video.resolution || file.video.bitrate)) ? (
                  <div>{file.video.codec || '—'} • {file.video.resolution || '—'} • {file.video.bitrate ? `${file.video.bitrate} kbps` : '—'}</div>
                ) : '—'}
              </div>
              <hr className="divider" />
              <strong>Audio tracks</strong>
              <div className="helper">
                {(file.audios || []).length ? (
                  <ul>
                    {file.audios.map((a, i) => <li key={i}>{a.language || '—'} • {a.codec || '—'} • {a.channels || '—'}</li>)}
                  </ul>
                ) : '—'}
              </div>
              <hr className="divider" />
              <strong>Subtitles</strong>
              <div className="helper">
                {(file.subtitles || []).length ? (
                  <ul>
                    {file.subtitles.map((s, i) => <li key={i}>{s.language || '—'} • {s.format || '—'}</li>)}
                  </ul>
                ) : '—'}
              </div>
            </div>
          </div>
        </div>
        <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn" onClick={onClose}>Close</button>
        </footer>
      </section>
    </div>
  );
}
