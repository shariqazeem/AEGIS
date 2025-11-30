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

# Check if Parallax is running (simple check)
if ! curl -s http://localhost:3001/v1/models > /dev/null; then
    echo "${YELLOW}⚠️  WARNING: Parallax does not appear to be running on port 3001${NC}"
    echo "   For full AI features, please run 'parallax run' in another terminal."
    echo "   Continuing in 5 seconds..."
    sleep 5
fi

# Start sentinel (which now includes video streaming on port 8001)
echo "1️⃣  Starting AI Sentinel + Video Server (Port 8001)..."
cd backend
source venv/bin/activate
python3 vision_sentinel.py > ../logs/sentinel.log 2>&1 &
SENTINEL_PID=$!
cd ..
sleep 3

if ps -p $SENTINEL_PID > /dev/null; then
    echo "${GREEN}   ✓ Sentinel + Video active${NC}"
else
    echo "${YELLOW}   ⚠ Sentinel failed to start (check logs/sentinel.log)${NC}"
fi

# Start frontend (this runs in foreground)
echo "2️⃣  Starting Frontend..."
echo ""
echo "=================================================="
echo "🟢 AEGIS IS NOW RUNNING"
echo "=================================================="
echo ""
echo "Video Feed:  http://localhost:8001/video_feed"
echo "API:         http://localhost:8001/status"
echo "Frontend:    Opening..."
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

npm run tauri dev

# Cleanup will run automatically on exit
