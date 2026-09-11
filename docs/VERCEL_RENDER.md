# Deploy: Vercel (kiosk) + Render (API)

Recommended production split for AYUVAANI.

## URLs

| App | URL |
| --- | --- |
| Kiosk (Vercel) | https://ayuvaani.vercel.app |
| API (Render) | https://ayuvaani-api.onrender.com |
| API health | https://ayuvaani-api.onrender.com/health |

## API (Render)

- Service: `ayuvaani-api` (Docker from repo root [`Dockerfile`](../Dockerfile))
- Blueprint: [`render.yaml`](../render.yaml)
- Repo: `dityaverma/voice-agents` @ `main`
- Set secrets in Render Dashboard → Environment (never commit):
  - `DATABASE_URL`, `GOOGLE_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`
  - `AWS_*`, voice keys (`DEEPGRAM_API_KEY`, `OPENAI_API_KEY`, `CARTESIA_API_KEY`)
  - `CORS_ORIGINS=https://ayuvaani.vercel.app`
  - Optional TURN: `TURN_URLS`, `TURN_USERNAME`, `TURN_CREDENTIAL`

Free Render services sleep after idle; first request may take ~30–60s.

## Client (Vercel)

- Project: `ayuvaani` (root directory `client/`)
- Public build endpoints: [`client/.env.production`](../client/.env.production)
- Redeploy: `cd client && npx vercel deploy --prod`

## Voice note

SmallWebRTC needs a TURN server for reliable mic/TTS off localhost. Signaling can work without TURN; audio often will not.
