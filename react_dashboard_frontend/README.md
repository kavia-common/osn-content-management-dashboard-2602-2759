# OSN Content Management Dashboard (React)

A lightweight React dashboard to upload and manage .ts video files and associated metadata for OSN set-top box streaming.

- Modern Ocean Professional theme (blue/amber accents)
- Sidebar + top bar layout, responsive cards and grids
- Hash-based routing (no extra dependencies)
- API client with mock mode for local development

## Quick Start

1) Install dependencies
- npm install

2) Configure environment
- cp .env.example .env
- Ensure these values point to your local backend:
  - REACT_APP_API_BASE=http://localhost:8000/api
  - REACT_APP_FRONTEND_URL=http://localhost:3000
  - REACT_APP_WS_URL=ws://localhost:8000
- Leave REACT_APP_FEATURE_FLAGS empty to use the real backend. To force mock mode, set:
  - REACT_APP_FEATURE_FLAGS=mock-api

3) Run the app
- npm start
- Visit http://localhost:3000

Create React App will run on port 3000 by default. Do not modify the preview system port.

## Environment Variables

- REACT_APP_API_BASE: Base URL for backend REST API; when empty, mock mode is enabled automatically. For FastAPI scaffold use http://localhost:8000/api
- REACT_APP_WS_URL: Optional WebSocket URL for real-time updates (reserved for future use).
- REACT_APP_FRONTEND_URL: Public URL of this frontend; used for mock preview links.
- REACT_APP_FEATURE_FLAGS: Comma-separated flags; include "mock-api" to force mock mode.
- Other optional build/runtime flags:
  REACT_APP_NODE_ENV, REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_PORT, REACT_APP_LOG_LEVEL, REACT_APP_HEALTHCHECK_PATH, REACT_APP_TRUST_PROXY, REACT_APP_EXPERIMENTS_ENABLED, REACT_APP_NEXT_TELEMETRY_DISABLED

See .env.example for a full list.

## Routing

This app uses a simple hash-based router:
- /dashboard
- /uploads
- /files

No external routing dependency is used; navigation is handled via window.location.hash.

## API Client

Located at src/api/client.js:
- listFiles({ q })
- getFile(id)
- createUpload({ file, title, description, tags, video, audios, subtitles }) -> POST /api/files/upload
- updateFile(id, data) -> PUT /api/files/{id}
- deleteFile(id) -> DELETE /api/files/{id}
- getPreviewUrl(id) -> GET /api/files/{id}/preview (supports Range)

The client automatically switches to an in-memory mock API when:
- REACT_APP_FEATURE_FLAGS includes "mock-api", or
- REACT_APP_API_BASE is empty.

This ensures the UI works without a backend.

## Pages and Components

- Pages:
  - Dashboard: Summary stats and recent files.
  - Uploads: Upload form and list combined.
  - Files: List, search, filter, details modal, preview, edit, delete.

- Components:
  - Layout: Sidebar, TopBar
  - Upload: UploadForm
  - Files: FileList, FileCard, FileDetailsModal
  - Common: Badge

## Accessibility

- All inputs are labeled (label for + id).
- Modal uses role="dialog", aria-modal, labelledby/ describedby.
- Focus is moved to close button on modal open.
- Buttons have aria labels for actions.

## Theme

Defined via CSS variables in src/index.css and src/App.css with:
- primary #2563EB
- secondary #F59E0B
- error #EF4444
- background #f9fafb
- surface #ffffff
- text #111827

Modern styling with rounded corners, shadows, gradients, and transitions.

## End-to-End Validation (Local)

Backend (FastAPI):
1) cd fastapi-backend_workspace/fastapi-backend
2) cp .env.example .env  # or use the provided .env
3) pip install -r requirements.txt
4) uvicorn app.main:app --host 0.0.0.0 --port 8000
5) curl http://localhost:8000/health  # {"status":"ok"}

Frontend (React):
1) cd osn-content-management-dashboard-2602-2759/react_dashboard_frontend
2) cp .env.example .env  # or use the provided .env
3) Ensure REACT_APP_API_BASE=http://localhost:8000/api
4) npm install
5) npm start
6) Visit http://localhost:3000

Flow:
- Upload: Navigate to /uploads, pick a .ts file, fill metadata, click Upload.
- List: See newly uploaded item in the list.
- Details: Open details modal from card actions.
- Preview: Click Preview to open GET /api/files/{id}/preview. Player should request with Range header (browser will handle).

## Testing

- npm test

## Build

- npm run build
