import os
import tempfile
from pathlib import Path

import pytest

# Point the app at a throwaway database before anything imports the settings.
_tmp = Path(tempfile.mkdtemp(prefix="prelegal-test-"))
os.environ["DATABASE_PATH"] = str(_tmp / "app.db")
os.environ["JWT_SECRET"] = "test-secret-that-is-at-least-32-bytes-long"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "60"

from fastapi.testclient import TestClient  # noqa: E402

from app.config import get_settings  # noqa: E402
from app.main import app  # noqa: E402

get_settings.cache_clear()


@pytest.fixture
def client():
    """A client whose lifespan recreates the database for each test."""
    with TestClient(app) as c:
        yield c
