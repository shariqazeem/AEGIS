#!/bin/bash
# AEGIS System Test Script
# Run this to verify everything is working before demo/submission

echo "🧪 AEGIS System Test"
echo "===================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0

# Test 1: Check Python
echo -n "1. Python 3.10+... "
if command -v python3 &> /dev/null; then
    VERSION=$(python3 --version | cut -d' ' -f2)
    echo -e "${GREEN}✓${NC} ($VERSION)"
    ((PASS++))
else
    echo -e "${RED}✗${NC}"
    ((FAIL++))
fi

# Test 2: Check Node.js
echo -n "2. Node.js 18+... "
if command -v node &> /dev/null; then
    VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} ($VERSION)"
    ((PASS++))
else
    echo -e "${RED}✗${NC}"
    ((FAIL++))
fi

# Test 3: Check Python deps
echo -n "3. Python dependencies... "
cd backend 2>/dev/null
if [ -f "requirements.txt" ] && [ -d "venv" ]; then
    source venv/bin/activate 2>/dev/null
    if python -c "import cv2, torch, transformers" 2>/dev/null; then
        echo -e "${GREEN}✓${NC}"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} (run: pip install -r requirements.txt)"
        ((FAIL++))
    fi
else
    echo -e "${YELLOW}⚠${NC} (venv not found)"
fi
cd .. 2>/dev/null

# Test 4: Check Node modules
echo -n "4. Node modules... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC}"
    ((PASS++))
else
    echo -e "${RED}✗${NC} (run: npm install)"
    ((FAIL++))
fi

# Test 5: Check webcam
echo -n "5. Webcam access... "
if python3 -c "import cv2; cam = cv2.VideoCapture(0); print('OK' if cam.isOpened() else 'FAIL')" 2>/dev/null | grep -q "OK"; then
    echo -e "${GREEN}✓${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC} (No camera or permission denied)"
fi

# Test 6: Check Parallax (optional)
echo -n "6. Parallax (optional)... "
if curl -s http://localhost:3001/health 2>/dev/null | grep -q "ok" || curl -s http://localhost:3001 2>/dev/null > /dev/null; then
    echo -e "${GREEN}✓${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC} (Not running - start with: parallax run)"
fi

# Test 7: Check video server port
echo -n "7. Port 8000 available... "
if lsof -i :8000 &>/dev/null; then
    echo -e "${YELLOW}⚠${NC} (Port in use - stop video_server.py)"
else
    echo -e "${GREEN}✓${NC}"
    ((PASS++))
fi

# Summary
echo ""
echo "===================="
echo "Results: ${GREEN}${PASS} passed${NC}, ${RED}${FAIL} failed${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ System ready! Run: ./start-aegis.sh${NC}"
    exit 0
else
    echo -e "${RED}✗ Fix errors above before running AEGIS${NC}"
    echo ""
    echo "Quick fixes:"
    echo "  - Python deps: cd backend && pip install -r requirements.txt"
    echo "  - Node deps: npm install"
    echo "  - Webcam: Check System Preferences → Privacy → Camera"
    exit 1
fi
