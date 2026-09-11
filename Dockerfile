# Unified AYUVAANI API (voice + OCR + DB)
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

# System deps sometimes needed by audio/webrtc stacks
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    build-essential \
    libglib2.0-0 \
    libgomp1 \
  && rm -rf /var/lib/apt/lists/*

COPY bot/pyproject.toml bot/uv.lock ./bot/
COPY bot/ ./bot/
COPY backend/ ./backend/

# Make `backend` importable as a package
RUN touch backend/__init__.py

RUN uv sync --project bot --frozen

ENV PYTHONUNBUFFERED=1
ENV HOST=0.0.0.0

EXPOSE 8080

CMD ["sh", "-c", "uv run --project bot uvicorn backend.server:app --host 0.0.0.0 --port ${PORT:-8080}"]
