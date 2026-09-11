# Deploy on Railway

Two services from this repo + your existing Supabase Postgres.

**Never commit `.env`.** Paste secrets only in Railway → Variables.

## 1. Connect GitHub

Create/deploy from your GitHub repo (e.g. `dityaverma/voice-agents`).

## 2. Service: `api`

| Setting | Value |
| --- | --- |
| Root Directory | `/` (repo root) |
| Config | [`railway.toml`](../railway.toml) |
| Healthcheck | `/health` |

### Variables (from your local `.env`)

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Supabase Postgres URL (`sslmode=require`) |
| `GOOGLE_API_KEY` | Gemini OCR |
| `GEMINI_API_KEY` | Embeddings (can match Google key if one key) |
| `GROQ_API_KEY` | RAG answer generation |
| `AWS_ACCESS_KEY_ID` | Textract (optional) |
| `AWS_SECRET_ACCESS_KEY` | Textract (optional) |
| `AWS_REGION` | e.g. `us-east-1` |
| `OCR_PROVIDER` | `aws` or `google` |
| `ABDM_CLIENT_ID` / `ABDM_CLIENT_SECRET` | placeholders OK until live ABDM |
| `DEEPGRAM_API_KEY` | voice STT (**required for mic**) |
| `OPENAI_API_KEY` | voice LLM |
| `CARTESIA_API_KEY` | voice TTS |
| `CORS_ORIGINS` | `https://<client-domain>` after client exists |
| `TURN_URLS` / `TURN_USERNAME` / `TURN_CREDENTIAL` | needed for remote audio |

Do **not** set `PORT=8000`. Railway injects `PORT`.

Generate a public domain, then open `https://<api>/health`.

## 3. Service: `client`

| Setting | Value |
| --- | --- |
| Root Directory | `/client` |
| Config | [`client/railway.toml`](../client/railway.toml) |

### Build-time variables

| Variable | Value |
| --- | --- |
| `VITE_BOT_OFFER_URL` | `https://<api-domain>/api/offer` |
| `VITE_API_BASE_URL` | `https://<api-domain>` |
| `VITE_TURN_URLS` | same as API `TURN_URLS` (optional but recommended) |
| `VITE_TURN_USERNAME` / `VITE_TURN_CREDENTIAL` | same as API |

Generate a public domain. Set `CORS_ORIGINS` on `api` to that URL and redeploy `api`.

## 4. Smoke test

1. Client loads over HTTPS  
2. `/health` on API is OK  
3. Start interview → `/api/offer` succeeds  
4. Two-way audio (requires TURN off localhost)  
5. OCR/DB only if AWS/Gemini + Supabase are valid  

## Security

If API keys were pasted in chat or committed, rotate them in Google / AWS / Supabase before production use.
