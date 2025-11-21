const BASE = process.env.REACT_APP_API_BASE || '';
const FEATURE_FLAGS = (process.env.REACT_APP_FEATURE_FLAGS || '').split(',').map(s => s.trim());
const USE_MOCK = !BASE || FEATURE_FLAGS.includes('mock-api');

const delay = (ms) => new Promise(r => setTimeout(r, ms));

// In-memory mock database
const mockDB = {
  files: [
    {
      id: 'f1',
      title: 'Sample TS Stream',
      description: 'A sample transport stream with multiple audio tracks.',
      tags: ['sample', 'test'],
      createdAt: new Date().toISOString(),
      size: 10485760,
      status: 'ready',
      video: { codec: 'H.264', resolution: '1920x1080', bitrate: 4500 },
      audios: [
        { language: 'en', codec: 'AAC', channels: '2.0' },
        { language: 'ar', codec: 'AAC', channels: '2.0' },
      ],
      subtitles: [
        { language: 'en', format: 'srt' }
      ]
    }
  ]
};

async function http(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';
  const isJSON = contentType.includes('application/json');
  if (!res.ok) {
    let errBody = {};
    try { errBody = isJSON ? await res.json() : { message: await res.text() }; } catch {}
    const error = new Error(errBody.message || `Request failed: ${res.status}`);
    error.status = res.status;
    error.body = errBody;
    throw error;
  }
  if (options.method === 'DELETE') return true;
  return isJSON ? res.json() : res.text();
}

/**
 * PUBLIC_INTERFACE
 * List files with optional search and status filter
 */
export async function listFiles({ q = '', status = '' } = {}) {
  if (USE_MOCK) {
    await delay(250);
    let arr = [...mockDB.files];
    if (q) {
      const qq = q.toLowerCase();
      arr = arr.filter(f => (f.title || '').toLowerCase().includes(qq) || (f.description || '').toLowerCase().includes(qq));
    }
    if (status) arr = arr.filter(f => f.status === status);
    return { items: arr, total: arr.length };
  }
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  // Note: backend does not support 'status' filter yet
  return http(`/files?${params.toString()}`);
}

/**
 * PUBLIC_INTERFACE
 * Get a file by id
 */
export async function getFile(id) {
  if (USE_MOCK) {
    await delay(150);
    const found = mockDB.files.find(f => f.id === id);
    if (!found) throw new Error('Not found');
    return found;
  }
  return http(`/files/${encodeURIComponent(id)}`);
}

/**
 * PUBLIC_INTERFACE
 * Create upload with multipart form: file (.ts) + metadata JSON fields
 * FastAPI: POST /api/files/upload with fields:
 *  - file (UploadFile), title (str), description (str, optional)
 *  - tags (JSON array string or comma-separated string, optional)
 *  - streams (JSON array of stream objects, optional) -> we map video/audios/subtitles into streams
 */
export async function createUpload(payload) {
  if (USE_MOCK) {
    await delay(400);
    const id = `f${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const { file, title, description, tags, video, audios, subtitles } = payload;
    mockDB.files.unshift({
      id, title, description,
      tags: (tags || '').split(',').map(t => t.trim()).filter(Boolean),
      createdAt: now,
      size: file ? file.size : 0,
      status: 'processing',
      video, audios, subtitles
    });
    return { id, status: 'queued' };
  }

  // Map UI metadata to backend 'streams' array (video/audio/subtitle)
  const streams = [];
  if (payload.video && (payload.video.codec || payload.video.resolution || payload.video.bitrate)) {
    streams.push({ type: 'video', codec: payload.video.codec, bitrate: Number(payload.video.bitrate) || undefined });
  }
  (payload.audios || []).forEach(a => {
    if (a.language || a.codec || a.channels) {
      streams.push({ type: 'audio', codec: a.codec, language: a.language, channels: Number(a.channels) || undefined });
    }
  });
  (payload.subtitles || []).forEach(s => {
    if (s.language || s.format) {
      streams.push({ type: 'subtitle', codec: s.format, language: s.language });
    }
  });

  const form = new FormData();
  if (payload.file) form.append('file', payload.file);
  form.append('title', payload.title || '');
  if (payload.description) form.append('description', payload.description);
  if (payload.tags) form.append('tags', payload.tags);
  if (streams.length) form.append('streams', JSON.stringify(streams));
  return http('/files/upload', { method: 'POST', body: form });
}

/**
 * PUBLIC_INTERFACE
 * Update editable file metadata
 * FastAPI expects PUT /api/files/{id} with body FileIn
 */
export async function updateFile(id, data) {
  if (USE_MOCK) {
    await delay(250);
    const idx = mockDB.files.findIndex(f => f.id === id);
    if (idx === -1) throw new Error('Not found');
    mockDB.files[idx] = { ...mockDB.files[idx], ...data };
    return mockDB.files[idx];
  }
  // Map to FileIn schema; only pass allowed fields if present
  const body = {};
  if (typeof data.title !== 'undefined') body.title = data.title;
  if (typeof data.description !== 'undefined') body.description = data.description;
  if (typeof data.tags !== 'undefined') body.tags = Array.isArray(data.tags) ? data.tags : String(data.tags).split(',').map(t => t.trim()).filter(Boolean);
  if (typeof data.streams !== 'undefined') body.streams = data.streams;
  return http(`/files/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

/**
 * PUBLIC_INTERFACE
 * Delete a file
 */
export async function deleteFile(id) {
  if (USE_MOCK) {
    await delay(200);
    const before = mockDB.files.length;
    mockDB.files = mockDB.files.filter(f => f.id !== id);
    return before !== mockDB.files.length;
  }
  return http(`/files/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/**
 * PUBLIC_INTERFACE
 * Get a preview URL for a video (from backend) or synthesize in mock
 */
export function getPreviewUrl(id) {
  if (USE_MOCK) {
    return `${process.env.REACT_APP_FRONTEND_URL || ''}/mock-preview/${id}.mp4`;
  }
  const u = new URL(`${BASE}/files/${encodeURIComponent(id)}/preview`);
  return u.toString();
}

export default {
  listFiles,
  getFile,
  createUpload,
  updateFile,
  deleteFile,
  getPreviewUrl
};
