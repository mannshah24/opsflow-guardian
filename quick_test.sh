#!/bin/bash

echo "🚀 OpsFlow Guardian 2.0 - Quick Test"
echo "====================================="

# Start server in background if not running
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "📡 Starting backend server..."
    cd /home/kartik-vyas/Downloads/Project/opsflow-guardian/backend
    /home/kartik-vyas/Downloads/Project/opsflow-guardian/backend/venv/bin/python main.py &
    SERVER_PID=$!
    echo "⏳ Waiting for server to start..."
    sleep 5
else
    echo "✅ Server is already running"
fi

echo ""
echo "🧪 Testing API Endpoints..."
echo ""

# Test health endpoint
echo "🔍 Health Check:"
curl -s http://localhost:8000/health | head -3
echo ""

# Test agents endpoint  
echo "🤖 Agents API:"
curl -s http://localhost:8000/api/v1/agents | jq -r '.[] | "\(.name) - \(.type)"' 2>/dev/null || curl -s http://localhost:8000/api/v1/agents | head -3
echo ""

# Test workflows endpoint
echo "⚙️  Workflows API:"
curl -s http://localhost:8000/api/v1/workflows | jq -r '.[] | "\(.name) - \(.status)"' 2>/dev/null || curl -s http://localhost:8000/api/v1/workflows | head -3
echo ""

# Test approvals endpoint
echo "✅ Approvals API:"
curl -s http://localhost:8000/api/v1/approvals | jq -r '.[] | "\(.title) - \(.status)"' 2>/dev/null || curl -s http://localhost:8000/api/v1/approvals | head -3
echo ""

echo "🎉 Backend Testing Complete!"
echo ""
echo "📊 Access the API documentation at: http://localhost:8000/docs"
echo "🔗 Health check at: http://localhost:8000/health"
echo "🌐 WebSocket endpoint: ws://localhost:8000/ws"
echo ""
echo "Now connect your React frontend to: http://localhost:8000/api/v1/"
