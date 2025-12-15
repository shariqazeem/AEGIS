# AEGIS Web Demo - Ubuntu Deployment Guide

This guide deploys AEGIS to your Ubuntu server so judges can test with their own browser cameras.

## Prerequisites

- Ubuntu 20.04+ server (Oracle Cloud Free Tier works great!)
- At least 2GB RAM
- Ports 80 and 443 open in firewall

## Quick Deploy (HTTP Only)

```bash
# 1. Clone the repo (gradient-cloud-demo branch)
git clone -b gradient-cloud-demo https://github.com/shariqazeem/AEGIS.git
cd AEGIS

# 2. Run deployment script
chmod +x deploy.sh
./deploy.sh
```

That's it! Your demo will be available at `http://YOUR_SERVER_IP`

## Deploy with SSL (HTTPS)

```bash
# With a domain name pointing to your server
./deploy.sh --ssl yourdomain.com
```

## Manual Docker Deploy

```bash
# Build and run
docker compose up -d --build

# View logs
docker compose logs -f aegis

# Stop
docker compose down
```

## Test Locally First

Before deploying to server, test locally:

```bash
cd backend
pip install -r requirements.txt
python web_sentinel.py
```

Then open http://localhost:8001 in your browser.

## How It Works

1. **Browser Camera**: WebRTC accesses your camera (stays in browser)
2. **WebSocket**: Frames sent to server as base64
3. **YOLO + Gradient Cloud**: Server analyzes frames
4. **Results**: Detection boxes and AI insights sent back

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                       │
│  ┌─────────────┐        ┌─────────────┐                │
│  │  WebRTC     │  --->  │  WebSocket  │                │
│  │  Camera     │        │  Client     │                │
│  └─────────────┘        └─────────────┘                │
└─────────────────────────────────────────────────────────┘
                              │
                              │ Base64 Frames
                              ▼
┌─────────────────────────────────────────────────────────┐
│                   UBUNTU SERVER                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              AEGIS Web Sentinel                  │   │
│  │  ┌─────────┐  ┌─────────┐  ┌───────────────┐  │   │
│  │  │  YOLO   │  │ Gradient│  │   FastAPI     │  │   │
│  │  │  v8n    │  │  Cloud  │  │   WebSocket   │  │   │
│  │  └─────────┘  └─────────┘  └───────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GRADIENT_API_KEY` | Gradient Cloud API key | Built-in demo key |

## Troubleshooting

**Camera not working?**
- Make sure you're using HTTPS or localhost (HTTP blocks camera on other domains)
- Check browser permissions

**Server not responding?**
- Check logs: `docker compose logs -f aegis`
- Verify port 80 is open: `sudo ufw allow 80`

**SSL not working?**
- Make sure domain points to server IP
- Check certbot logs: `docker compose logs certbot`

## Demo URL for Judges

After deployment, share this URL:
```
http://YOUR_SERVER_IP
```

Judges can:
1. Allow camera access
2. See themselves detected in real-time
3. Test threat scenarios (hold up scissors, phone, etc.)
4. Ask AI questions
