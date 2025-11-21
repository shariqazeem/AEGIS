#!/bin/bash
# AEGIS Startup Script
# Starts all required services for the AEGIS system

set -e

echo "=" 50
echo "🛡️  AEGIS - Starting All Systems"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the AEGIS root directory"
    exit 1
fi

# Check Python venv
if [ ! -d "backend/venv" ]; then
    echo "⚠️  Python venv not found. Creating..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Check Node modules
if [ ! -d "node_modules" ]; then
    echo "⚠️  Node modules not found. Installing..."
    npm install
fi

echo ""
echo "${GREEN}✓${NC} All dependencies ready"
echo ""
echo "Starting services..."
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down AEGIS..."
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start video server in background
echo "1️⃣  Starting Video Server (Port 8000)..."
cd backend
source venv/bin/activate
python video_server.py > ../logs/video_server.log 2>&1 &
VIDEO_PID=$!
cd ..
sleep 2

# Check if video server started successfully
if ps -p $VIDEO_PID > /dev/null; then
    echo "${GREEN}   ✓ Video server running${NC}"
else
    echo "${YELLOW}   ⚠ Video server failed to start (check logs/video_server.log)${NC}"
fi

# Start sentinel in background
echo "2️⃣  Starting AI Sentinel..."
cd backend
python vision_sentinel.py > ../logs/sentinel.log 2>&1 &
SENTINEL_PID=$!
cd ..
sleep 2

if ps -p $SENTINEL_PID > /dev/null; then
    echo "${GREEN}   ✓ Sentinel active${NC}"
else
    echo "${YELLOW}   ⚠ Sentinel failed to start (check logs/sentinel.log)${NC}"
fi

# Start frontend (this runs in foreground)
echo "3️⃣  Starting Frontend..."
echo ""
echo "=================================================="
echo "🟢 AEGIS IS NOW RUNNING"
echo "=================================================="
echo ""
echo "Video Feed:  http://localhost:8000/video_feed"
echo "Sentinel:    Running (check logs/sentinel.log)"
echo "Frontend:    Opening..."
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

npm run tauri dev

# Cleanup will run automatically on exit
