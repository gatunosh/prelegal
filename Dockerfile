# syntax=docker/dockerfile:1

# --- Stage 1: build the frontend into a static site -------------------------
FROM node:24-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# --- Stage 2: backend runtime ----------------------------------------------
FROM python:3.13-slim AS runtime
COPY --from=ghcr.io/astral-sh/uv:0.12.8 /uv /uvx /bin/

WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    DATABASE_PATH=/app/data/app.db \
    STATIC_DIR=/app/static

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen --no-dev

COPY backend/app ./app
COPY --from=frontend /app/frontend/out ./static

EXPOSE 8000
CMD ["uv", "run", "--no-sync", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
