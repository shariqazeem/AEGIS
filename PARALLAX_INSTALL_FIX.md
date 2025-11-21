# Parallax Installation Fix

## Issue
```
ERROR: editable mode currently requires a setuptools-based build
pip version 21.2.4 is too old
```

## Solution

### Step 1: Upgrade pip (REQUIRED)

```bash
cd /Users/macbookair/projects/AEGIS/parallax
source ./venv/bin/activate

# Upgrade pip to latest version
python3 -m pip install --upgrade pip
```

### Step 2: Install Parallax for macOS

```bash
# Now install Parallax (with upgraded pip)
pip install -e '.[mac]'
```

This should work now!

---

## Alternative: Non-editable Install

If the above still fails, you can install without editable mode:

```bash
pip install '.[mac]'
```

(Note: Just `pip install` without `-e`)

This works the same way for running Parallax, you just can't edit the source code.

---

## Verify Installation

After successful install:

```bash
# Check if parallax command is available
which parallax

# Should show something like:
# /Users/macbookair/projects/AEGIS/parallax/venv/bin/parallax

# Try running it
parallax --help
```

If you see the help menu, **Parallax is installed!** ✅

---

## Next Steps

Once installed, continue with:

```bash
# Terminal 1: Start scheduler
parallax run

# Terminal 2: Join worker
parallax join
```

Then follow the rest of SETUP_CHECKLIST.md
