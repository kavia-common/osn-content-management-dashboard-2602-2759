# osn-content-management-dashboard-2602-2759

This workspace contains the OSN Content Management Dashboard frontend.

- Container: react_dashboard_frontend (port 3000)
- Framework: React (Create React App)
- Purpose: Upload and manage .ts video files and metadata

Backend scaffold is located at: ../../fastapi-backend_workspace/fastapi-backend

Environment alignment for local dev:
- Frontend .env:
  - REACT_APP_API_BASE=http://localhost:8000/api
  - REACT_APP_FRONTEND_URL=http://localhost:3000
  - REACT_APP_WS_URL=ws://localhost:8000
- Backend .env:
  - CORS_ORIGINS=http://localhost:3000
  - STORAGE_DIR=./storage
  - LOG_LEVEL=info

See react_dashboard_frontend/README.md for detailed frontend instructions, and fastapi-backend/README.md for backend API and setup.