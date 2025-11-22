# 🧪 AEGIS Testing Guide

## Quick Start Testing

### Performance Modes

Edit `backend/vision_sentinel.py` line 45 to change performance mode:

```python
PERFORMANCE_MODE = "balanced"  # Options: "performance", "balanced", "eco"
```

- **Performance Mode** (2.5s): Real AI, fast updates - use when plugged in
- **Balanced Mode** (5s): Real AI, slower - **recommended for M1 Air**
- **Eco Mode** (10s): Mock vision, very light - for testing/development

### Testing Threat Detection

#### Method 1: Real AI (Moondream) Testing
With `VISION_MODEL = "moondream"` and Moondream loaded:

1. **SAFE Scenarios:**
   - Sit normally at your desk
   - Read a book
   - Type on keyboard
   - Drink water

2. **THREAT Scenarios:**
   - **Fall Detection**: Lie down on floor in camera view
   - **Fire/Smoke**: Hold up red paper or red object (triggers red detection)
   - **Emergency**: Make distress gestures, wave frantically
   - **Help Sign**: Hold up paper with "HELP" or "FIRE" written on it
   - **Dark Environment**: Turn off lights (low visibility alert)

#### Method 2: Mock Vision Testing
With `VISION_MODEL = "mock"` (lighter, for development):

The mock system cycles through test scenarios automatically:

- **Every ~30 frames**: Simulates fall detection
- **Every ~60 frames**: Simulates smoke detection
- **Every ~90 frames**: Simulates HELP sign
- **Red objects**: Hold up red paper → triggers fire/danger alert
- **Dark room**: Cover camera or turn off lights → low visibility alert
- **Bright flash**: Shine flashlight at camera → unusual flash alert

### Understanding the Logs

```
[22:13:49] DEBUG: Analyzing frame...
[22:13:51] INFO: ✓ Normal: Normal office environment...
```
= SAFE scenario

```
[22:16:42] CRITICAL: ⚠️ THREAT #1: potential_threat (confidence: 75%) - Alert security
THREAT DETECTED
```
= THREAT detected

### Common Issues

#### 1. "Reasoning failed: 'NoneType' object has no attribute 'content'"
**Fixed!** This was a Parallax API response parsing error. The new code handles this gracefully and falls back to mock reasoning.

#### 2. Laptop Running Slow
**Solution:** Change to "balanced" or "eco" mode in vision_sentinel.py:
```python
PERFORMANCE_MODE = "balanced"  # or "eco"
```

#### 3. Parallax Not Detected
**Check:** Is Parallax running in separate terminals?
```bash
# Terminal 1
parallax start

# Terminal 2
parallax join
```

#### 4. Camera Showing Wrong Feed
**Fixed!** The new camera detection prioritizes 720p cameras (MacBook FaceTime) over screen capture devices.

## Testing Workflow

### Daily Development (M1 Air)
```python
# In backend/vision_sentinel.py
PERFORMANCE_MODE = "eco"        # Light on resources
VISION_MODEL = "mock"           # No AI model loading
```

### Demo/Presentation
```python
# In backend/vision_sentinel.py
PERFORMANCE_MODE = "performance"  # Fast, plug in charger
VISION_MODEL = "moondream"        # Real AI
```

### Production on M1 Air
```python
# In backend/vision_sentinel.py
PERFORMANCE_MODE = "balanced"    # Good balance
VISION_MODEL = "moondream"       # Real AI
```

## Frontend Testing

The Tauri app shows:
- **SAFE** status = Green indicator
- **THREAT DETECTED** status = Red alert + log entry

Check the "Neural Inference Log" panel for all system events.

## Manual Testing Checklist

- [ ] Video feed shows FaceTime camera (not screen capture)
- [ ] Parallax connects successfully
- [ ] Normal scene → "SAFE" status
- [ ] Hold red paper → Threat detection
- [ ] Turn off lights → Low visibility warning
- [ ] Check frontend updates in real-time
- [ ] Verify logs appear in frontend
- [ ] Test "balanced" mode doesn't lag (M1 Air)

## Advanced Testing

### Test Parallax API Directly
```bash
curl -X POST http://localhost:3001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3-0.6B",
    "messages": [{"role": "user", "content": "test"}],
    "max_tokens": 5
  }'
```

### Monitor CPU Usage
```bash
# In another terminal
top -pid $(pgrep -f vision_sentinel)
```

### Check Camera Devices
```bash
# See what cameras are available
system_profiler SPCameraDataType
```

## Tips for Competition Demo

1. **Start in "eco" mode** while setting up
2. **Switch to "performance" mode** right before demo
3. **Test all scenarios** beforehand:
   - Show normal monitoring
   - Demonstrate fall detection (lie down)
   - Show red object detection
   - Prove it works offline (unplug ethernet!)
4. **Keep Parallax running** in background terminals
5. **Monitor battery** - plug in if possible

## Troubleshooting

### Issue: False Positives
**Solution:** Adjust `THREAT_KEYWORDS` in vision_sentinel.py line 55-57

### Issue: Too Slow on Battery
**Solution:** Use "balanced" mode (5s) or "eco" mode (10s)

### Issue: Model Loading Fails
**Solution:**
```bash
cd backend
pip install --upgrade transformers torch
```

### Issue: Parallax Timeout
**Solution:** Already increased to 10s with retries, but if still failing:
```python
# In vision_sentinel.py line 216
timeout=20  # Increase further if needed
```

---

**For Competition Judges:**
- The "balanced" mode demonstrates real-world practicality on consumer hardware
- The mock mode shows how the agentic workflow operates without heavy AI
- The system gracefully degrades if Parallax is offline (true edge computing!)
