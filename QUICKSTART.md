# AEGIS Quick Start

**Get up and running in 5 minutes!**

## Your Workflow (User)

You mentioned you'll handle the **frontend** first, then I'll build the **backend**.

Here's what you need to do:

---

## Frontend Development (Your Part)

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs React, Tauri, Tremor UI, and all frontend dependencies.

### 2. Run Development Server

**For rapid UI development** (web-only mode):
```bash
npm run dev
```

Then open: `http://localhost:3000`

**For native macOS app** (slower, but production-like):
```bash
npm run tauri:dev
```

### 3. Your Starting Point

The main file you'll work on is:
```
frontend/src/App.jsx
```

This already has:
- ✅ Complete dashboard layout
- ✅ Live video feed component (connects to backend on port 8000)
- ✅ Threat status badge
- ✅ Event log
- ✅ Neural load metrics
- ✅ Mode switcher (Home/Industrial)

### 4. Customization Ideas

**Change colors:**
```javascript
// In App.jsx, modify the Badge color:
<Badge color="emerald">  // Try: "rose", "indigo", "amber"
```

**Add components:**
```javascript
// Tremor has many pre-built components:
import { AreaChart, BarList, DonutChart } from "@tremor/react";
```

**Modify theme:**
```javascript
// In tailwind.config.js, extend colors:
colors: {
  cyber: {
    accent: '#00ff00'  // Change accent color
  }
}
```

### 5. Testing Without Backend

The frontend works even if the backend isn't running yet. You'll see:
- "Waiting for backend connection..." placeholder
- The UI will still be fully functional

Once the backend is running (I'll build it), the video feed will automatically connect.

---

## Backend Development (My Part - After You're Done)

Once you're happy with the frontend, let me know and I'll:

1. **Set up Moondream** with MLX optimization
2. **Integrate Parallax** for multi-model orchestration
3. **Connect Llama-3.2** for reasoning
4. **Implement the full agentic workflow**

---

## Current Project Status

```
✅ Project structure created
✅ Frontend scaffold with Tremor UI
✅ Backend API skeleton
✅ Documentation complete
⏳ Waiting for you to customize the frontend
⏳ Then I'll implement the AI backend
```

---

## Useful Commands

```bash
# Frontend
cd frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run tauri:dev        # Run as native app

# Backend (when ready)
cd backend
python test_backend.py   # Verify setup
python vision_sentinel.py # Start API server

# Git
git status              # Check changes
git add .               # Stage all files
git commit -m "msg"     # Commit
git push                # Push to remote
```

---

## File Structure Quick Reference

```
AEGIS/
├── frontend/
│   ├── src/
│   │   └── App.jsx          👈 YOUR MAIN WORK FILE
│   ├── package.json
│   └── tailwind.config.js   👈 Customize theme here
│
├── backend/
│   ├── vision_sentinel.py   👈 I'LL BUILD THIS NEXT
│   └── requirements.txt
│
└── docs/
    ├── SETUP.md             👈 Full installation guide
    └── ARCHITECTURE.md      👈 Technical details
```

---

## When You're Ready for Backend

Just say:

> "Frontend is done, build the backend now"

And I'll implement:
- Moondream vision integration
- Parallax orchestration
- Llama-3.2 reasoning
- Full threat detection pipeline

---

## Questions?

- **How do I change the layout?** → Edit `App.jsx`, Tremor components are easy to rearrange
- **How do I add new pages?** → For now, keep it single-page. We can add routing later if needed.
- **Can I test the video feed?** → Yes! Just run the backend with `python vision_sentinel.py`

---

## Next Steps

1. ✅ Run `cd frontend && npm install`
2. ✅ Run `npm run dev`
3. ✅ Open `http://localhost:3000`
4. 🎨 Customize `App.jsx` to your liking
5. 💬 Tell me when you're ready for the backend!

**Good luck! The frontend looks cinema-grade already. 🎬**
