"""FastAPI entrypoint: recreates the database on startup, exposes the API,
and serves the compiled frontend."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from .auth import router as auth_router
from .config import get_settings
from .db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Prelegal API", version="0.1.0", lifespan=lifespan)

app.include_router(auth_router)


@app.get("/api/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


# Serve the compiled frontend at the root, if it was built into static_dir.
# Registered last so /api/* routes always take precedence.
_static_dir = get_settings().static_dir
if _static_dir.is_dir():
    app.mount("/", StaticFiles(directory=_static_dir, html=True), name="frontend")
