#!/bin/bash

# AEGIS Parallax Demo Startup Script
# Starts Parallax cluster for competition demo

set -e

echo "================================================"
echo "  AEGIS + Parallax Demo Startup"
echo "  Parallax AI Lab Competition 2025"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "parallax" ]; then
    echo -e "${RED}Error: parallax directory not found${NC}"
    echo "Please run this script from the AEGIS root directory"
    exit 1
fi

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}Warning: Port $1 is already in use${NC}"
        return 1
    fi
    return 0
}

echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

# Check if Parallax is installed
cd parallax

if [ ! -d "venv" ]; then
    echo -e "${RED}Error: Parallax virtual environment not found${NC}"
    echo "Please install Parallax first:"
    echo "  cd parallax"
    echo "  python3 -m venv ./venv"
    echo "  source ./venv/bin/activate"
    echo "  pip install -e '.[mac]'"
    exit 1
fi

echo -e "${GREEN}✓ Parallax virtual environment found${NC}"

# Check ports
echo ""
echo -e "${BLUE}Step 2: Checking ports...${NC}"
check_port 3001 || echo "  (Parallax scheduler might already be running)"
check_port 3000 || echo "  (Parallax node might already be running)"
echo ""

# Activate virtual environment
echo -e "${BLUE}Step 3: Activating Parallax virtual environment...${NC}"
source ./venv/bin/activate
echo -e "${GREEN}✓ Virtual environment activated${NC}"
echo ""

# Get local IP
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")

# Start Parallax scheduler
echo -e "${BLUE}Step 4: Starting Parallax scheduler...${NC}"
echo ""
echo "Model: Qwen/Qwen3-0.6B"
echo "Nodes: 1 (expandable)"
echo "Host: 0.0.0.0 (accessible from network)"
echo "Local IP: $LOCAL_IP"
echo ""
echo -e "${YELLOW}Starting scheduler in 3 seconds...${NC}"
echo "Press Ctrl+C to cancel"
sleep 3

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Parallax Scheduler Starting...${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "After scheduler starts:"
echo ""
echo "1. Open Parallax UI:"
echo -e "   ${BLUE}http://localhost:3001${NC}"
echo ""
echo "2. In a NEW terminal, join the cluster:"
echo -e "   ${YELLOW}cd $(pwd)${NC}"
echo -e "   ${YELLOW}source ./venv/bin/activate${NC}"
echo -e "   ${YELLOW}parallax join${NC}"
echo ""
echo "3. Then start AEGIS:"
echo -e "   ${YELLOW}cd ..${NC}"
echo -e "   ${YELLOW}./start-aegis.sh${NC}"
echo ""
echo "4. Open AEGIS Dashboard:"
echo -e "   ${BLUE}http://localhost:1420${NC}"
echo ""
echo -e "${GREEN}================================================${NC}"
echo ""

# Start Parallax scheduler
parallax run -m Qwen/Qwen3-0.6B -n 1 --host 0.0.0.0
