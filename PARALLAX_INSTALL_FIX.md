# Parallax Installation Fix

## Issue 1: Python Version Too Old ❌
```
ERROR: Package 'parallax' requires a different Python: 3.9.6 not in '<3.14,>=3.11'
```

**Your Python:** 3.9.6
**Required:** 3.11.0 - 3.13.x

## Solution: Install Python 3.12

### Option 1: Using Homebrew (Recommended)

```bash
# Install Python 3.12 via Homebrew
brew install python@3.12

# Verify installation
python3.12 --version
# Should show: Python 3.12.x
```

### Option 2: Download from python.org

Visit: https://www.python.org/downloads/macos/
Download: Python 3.12.x installer for macOS

---

## Recreate Virtual Environment with Python 3.12

```bash
# Go to parallax directory
cd /Users/macbookair/projects/AEGIS/parallax

# Remove old venv (Python 3.9.6)
rm -rf ./venv

# Create NEW venv with Python 3.12
python3.12 -m venv ./venv

# Activate new venv
source ./venv/bin/activate

# Verify Python version in venv
python --version
# Should show: Python 3.12.x

# Upgrade pip (optional but recommended)
pip install --upgrade pip

# Install Parallax for macOS
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
