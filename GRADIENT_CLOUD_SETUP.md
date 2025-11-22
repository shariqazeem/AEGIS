# 🚀 Gradient Cloud API Setup (Development Mode)

## Why Use Gradient Cloud?

For **development and testing**, using Gradient Cloud API is much faster than running Parallax locally on M1 Air:

- **✅ Fast**: No local model loading, instant responses
- **✅ Light**: Zero CPU/RAM usage on your M1 Air
- **✅ Powerful**: Access to Qwen3-235B-Instruct (much better than Qwen3-0.6B)
- **✅ Easy Switch**: One line change to switch to Parallax for demo

## Quick Start

### 1. Install requests library
```bash
cd backend
pip install requests
```

### 2. Choose Backend (Already Set!)

The system is **already configured** to use Gradient Cloud:

```python
# In backend/vision_sentinel.py line 64
LLM_BACKEND = "gradient"  # ✅ Already set for you!
```

### 3. Run Vision Sentinel

```bash
cd backend
python vision_sentinel.py
```

You should see:
```
[INFO] Backend: Gradient Cloud
[SUCCESS] ✓ Gradient Cloud ready
```

That's it! No Parallax needed for development. 🎉

## Backend Options

Edit `backend/vision_sentinel.py` line 64:

### For Development (Current - FAST! ⚡)
```python
LLM_BACKEND = "gradient"  # Uses Gradient Cloud API
```
- ✅ Fast responses (~1-2 seconds)
- ✅ No local model loading
- ✅ Better quality (Qwen3-235B)
- ✅ Your M1 Air stays cool

### For Final Demo (Competition Submission)
```python
LLM_BACKEND = "parallax"  # Uses local Parallax
```
- ✅ Shows local inference (required for competition)
- ✅ Privacy-first (no cloud)
- ✅ Offline capable
- ⚠️ Requires Parallax running in background

### For Ultra-Light Testing
```python
LLM_BACKEND = "mock"  # Keyword-based, no AI
```
- ✅ Instant responses
- ✅ Zero AI processing
- ⚠️ Simple keyword matching only

## Performance Comparison

| Backend | Response Time | CPU Usage | Quality | Use Case |
|---------|--------------|-----------|---------|----------|
| **Gradient** | ~1-2s | 0% | ⭐⭐⭐⭐⭐ | **Development** ✅ |
| **Parallax** | ~5-10s | 80% | ⭐⭐⭐ | **Final Demo** |
| **Mock** | Instant | 0% | ⭐ | Quick Testing |

## How It Works

```
┌─────────────────┐
│  Camera Feed    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Moondream AI   │  ← Analyzes video frame
│  (Vision)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Gradient Cloud │  ← Reasons about threats
│  API (LLM)      │     (qwen3-235b-instruct)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Tauri Frontend │  ← Shows results
└─────────────────┘
```

## Switching to Parallax for Demo

When you're ready to submit or demo:

1. **Edit config:**
   ```python
   # backend/vision_sentinel.py line 64
   LLM_BACKEND = "parallax"
   ```

2. **Start Parallax:**
   ```bash
   # Terminal 1
   parallax start

   # Terminal 2
   parallax join
   ```

3. **Run vision sentinel:**
   ```bash
   python vision_sentinel.py
   ```

That's it! The code is the same, just different backend.

## API Key Security

The API key is hardcoded for development. For production, use environment variables:

```python
# Better approach (future):
GRADIENT_API_KEY = os.getenv("GRADIENT_API_KEY")
```

## Competition Strategy

1. **Development Phase (Now):** Use Gradient Cloud
   - Build faster
   - Test more features
   - Perfect the UI

2. **Demo Phase (Submission):** Switch to Parallax
   - Show local inference
   - Demonstrate privacy
   - Prove offline capability

3. **Presentation:** Show both!
   - "Developed with Gradient Cloud for speed"
   - "Runs on Parallax for privacy"
   - "Best of both worlds"

## Troubleshooting

### Issue: "Connection failed"
**Check:**
- Internet connection (Gradient Cloud requires internet)
- API key is valid (already set in code)

### Issue: Still slow
**Solution:**
- Make sure `LLM_BACKEND = "gradient"` (not "parallax")
- Check `PERFORMANCE_MODE = "balanced"` for reasonable intervals

### Issue: Want to test offline mode
**Solution:**
- Switch to `LLM_BACKEND = "parallax"`
- Or use `LLM_BACKEND = "mock"` for instant keyword detection

---

**Pro Tip:** Keep two versions of the config:
- `vision_sentinel.py` with `gradient` for daily development
- `vision_sentinel_demo.py` with `parallax` for competition demos

Just copy the file and change line 64! 🚀
