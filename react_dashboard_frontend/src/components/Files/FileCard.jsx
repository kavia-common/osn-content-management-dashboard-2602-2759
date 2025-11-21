import React from 'react';
import Badge from '../Common/Badge';

/**
 * PUBLIC_INTERFACE
 * FileCard shows a summary of a file and provides action buttons.
 */
export default function FileCard({ file, onView, onPreview, onEdit, onDelete }) {
  return (
    <div className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontWeight: 800 }}>{file.title || 'Untitled'}</div>
          <div className="helper">{new Date(file.createdAt).toLocaleString()}</div>
        </div>
        <Badge color={file.status === 'ready' ? 'green' : (file.status === 'error' ? 'red' : 'amber')}>
          {file.status || 'unknown'}
        </Badge>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(file.tags || []).map((t, i) => <Badge key={i} color="blue">#{t}</Badge>)}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={() => onView(file)}>Details</button>
        <button className="btn btn-primary" onClick={() => onPreview(file)}>Preview</button>
        <button className="btn" onClick={() => onEdit(file)}>Edit</button>
        <button className="btn btn-danger" onClick={() => onDelete(file)}>Delete</button>
      </div>
    </div>
  );
}
