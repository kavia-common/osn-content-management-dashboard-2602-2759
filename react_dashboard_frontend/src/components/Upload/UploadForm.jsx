import React, { useRef, useState } from 'react';
import { createUpload } from '../../api/client';

/**
 * PUBLIC_INTERFACE
 * UploadForm: accepts .ts file and metadata, supports multiple audio/subtitle tracks.
 */
export default function UploadForm({ onCreated }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [video, setVideo] = useState({ codec: '', resolution: '', bitrate: '' });
  const [audios, setAudios] = useState([{ language: '', codec: '', channels: '' }]);
  const [subtitles, setSubtitles] = useState([{ language: '', format: '' }]);

  const addAudio = () => setAudios(a => [...a, { language: '', codec: '', channels: '' }]);
  const removeAudio = (i) => setAudios(a => a.filter((_, idx) => idx !== i));
  const setAudioField = (i, k, v) => setAudios(a => a.map((row, idx) => idx === i ? { ...row, [k]: v } : row));

  const addSub = () => setSubtitles(s => [...s, { language: '', format: '' }]);
  const removeSub = (i) => setSubtitles(s => s.filter((_, idx) => idx !== i));
  const setSubField = (i, k, v) => setSubtitles(s => s.map((row, idx) => idx === i ? { ...row, [k]: v } : row));

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError('Please select a .ts file');
      return;
    }
    if (!file.name.toLowerCase().endsWith('.ts')) {
      setError('Only .ts files are allowed');
      return;
    }
    setBusy(true);
    try {
      await createUpload({
        file, title, description, tags,
        video,
        audios: audios.filter(a => a.language || a.codec || a.channels),
        subtitles: subtitles.filter(s => s.language || s.format)
      });
      fileRef.current.value = '';
      setTitle(''); setDescription(''); setTags('');
      setVideo({ codec: '', resolution: '', bitrate: '' });
      setAudios([{ language: '', codec: '', channels: '' }]);
      setSubtitles([{ language: '', format: '' }]);
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card" onSubmit={onSubmit} aria-labelledby="upload-title">
      <header style={{ paddingBottom: 8 }}>
        <h2 id="upload-title" style={{ margin: 0 }}>New Upload</h2>
        <p className="helper" id="upload-desc">Upload a .ts file and provide metadata.</p>
      </header>
      <div className="grid" style={{ gap: 14 }}>
        <div>
          <label className="label" htmlFor="file">File (.ts)</label>
          <input id="file" ref={fileRef} className="input" type="file" accept=".ts" aria-describedby="upload-desc" />
        </div>
        <div className="grid grid-2">
          <div>
            <label className="label" htmlFor="title">Title</label>
            <input id="title" className="input" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="label" htmlFor="tags">Tags (comma-separated)</label>
            <input id="tags" className="input" value={tags} onChange={e => setTags(e.target.value)} placeholder="sports, 1080p" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" className="textarea" rows="3" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="card" style={{ padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Video metadata</h3>
          <div className="grid grid-3">
            <div>
              <label className="label" htmlFor="vcodec">Codec</label>
              <input id="vcodec" className="input" value={video.codec} onChange={e => setVideo({ ...video, codec: e.target.value })} placeholder="H.264" />
            </div>
            <div>
              <label className="label" htmlFor="vres">Resolution</label>
              <input id="vres" className="input" value={video.resolution} onChange={e => setVideo({ ...video, resolution: e.target.value })} placeholder="1920x1080" />
            </div>
            <div>
              <label className="label" htmlFor="vbit">Bitrate (kbps)</label>
              <input id="vbit" className="input" value={video.bitrate} onChange={e => setVideo({ ...video, bitrate: e.target.value })} placeholder="4500" />
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Audio tracks</h3>
          {audios.map((row, i) => (
            <div key={i} className="grid grid-3" style={{ alignItems: 'end' }}>
              <div>
                <label className="label" htmlFor={`alang-${i}`}>Language</label>
                <input id={`alang-${i}`} className="input" value={row.language} onChange={e => setAudioField(i, 'language', e.target.value)} placeholder="en" />
              </div>
              <div>
                <label className="label" htmlFor={`acodec-${i}`}>Codec</label>
                <input id={`acodec-${i}`} className="input" value={row.codec} onChange={e => setAudioField(i, 'codec', e.target.value)} placeholder="AAC" />
              </div>
              <div>
                <label className="label" htmlFor={`achan-${i}`}>Channels</label>
                <input id={`achan-${i}`} className="input" value={row.channels} onChange={e => setAudioField(i, 'channels', e.target.value)} placeholder="2.0" />
              </div>
              <div>
                <button type="button" className="btn btn-danger" onClick={() => removeAudio(i)} aria-label={`Remove audio track ${i + 1}`}>Remove</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <button type="button" className="btn btn-primary" onClick={addAudio}>Add audio</button>
          </div>
        </div>
        <div className="card" style={{ padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Subtitle tracks</h3>
          {subtitles.map((row, i) => (
            <div key={i} className="grid grid-3" style={{ alignItems: 'end' }}>
              <div>
                <label className="label" htmlFor={`slang-${i}`}>Language</label>
                <input id={`slang-${i}`} className="input" value={row.language} onChange={e => setSubField(i, 'language', e.target.value)} placeholder="en" />
              </div>
              <div>
                <label className="label" htmlFor={`sformat-${i}`}>Format</label>
                <input id={`sformat-${i}`} className="input" value={row.format} onChange={e => setSubField(i, 'format', e.target.value)} placeholder="srt" />
              </div>
              <div>
                <button type="button" className="btn btn-danger" onClick={() => removeSub(i)} aria-label={`Remove subtitle track ${i + 1}`}>Remove</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <button type="button" className="btn btn-primary" onClick={addSub}>Add subtitle</button>
          </div>
        </div>
      </div>
      <footer style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="submit" className="btn btn-primary" disabled={busy} aria-busy={busy}>
          {busy ? 'Uploading...' : 'Upload'}
        </button>
        {error ? <span role="alert" style={{ color: 'var(--error)', fontWeight: 600 }}>{error}</span> : null}
      </footer>
    </form>
  );
}
