#!/bin/bash
cd /home/kavia/workspace/code-generation/osn-content-management-dashboard-2602-2759/react_dashboard_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

