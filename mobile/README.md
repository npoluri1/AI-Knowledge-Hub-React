# AI Knowledge Hub — Mobile App (iOS + Android)

React Native (Expo) client for the **same FastAPI backend** the web app uses.
One backend, three clients: web + iOS + Android. No separate mobile backend.

## Features

| Tab | What's inside |
|---|---|
| ⚡ Home | Live global indices strip + quick navigation |
| 📚 Learn | 23 chapters + deep dives, full-text search, AI knowledge chat (`/api/chat`) |
| 📈 Market | Global indices + popular quotes for US/IN/GB/JP/SG/HK/KR/AU/EU/Crypto |
| 📰 News | AI news from 200+ RSS/scraped sources with category + source filters |
| ⋯ More | Video Hub · LinkedIn Posts · **AI Jobs** · **Trading Desk** · **Financial Advisor** · Files & Gallery · Settings |

Backend endpoints consumed (all existing, zero backend changes):
`/api/chapters`, `/api/deep-dive`, `/api/search`, `/api/chat`, `/api/market/*`,
`/api/news/*`, `/api/jobs`, `/api/trading/daily-trading`, `/api/trading/live-investments`,
`/api/advisor/analyze`, `/api/advisor/news`, `/api/videos/*`, `/api/linkedin-posts/*`, `/api/files`.

## Run the backend first

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 9000
```

`--host 0.0.0.0` is required so phones on the same Wi-Fi can reach it.

## Run the mobile app (development)

```bash
cd mobile
npm install
npm start            # Expo dev server
```

Then:
- **Android:** press `a` (needs an emulator/device) or scan the QR with Expo Go
- **iPhone:** scan the QR with the Camera app → opens in Expo Go

### Point the app at your backend

The app defaults to `http://localhost:9000` (works for emulators). For a **physical
phone**, set your PC's LAN IP before starting:

```bash
# Windows: ipconfig  →  IPv4 Address
EXPO_PUBLIC_API_URL=http://192.168.1.20:9000 npm start
```

Or change it anytime inside the app: **More → Settings → API Server → Test connection**.

### Production build (APK / IPA)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview   # installable .apk
eas build --platform ios                          # needs Apple Developer account
```

For store builds set a public HTTPS API URL in `app.json` → `expo.extra.defaultApiUrl`
(e.g. your VPS / Railway / Fly.io deployment), or ship with Settings configured.

## Typecheck & bundle verification

```bash
npm run typecheck                 # tsc --noEmit
npx expo export --platform android   # verifies Hermes bundle compiles
```
