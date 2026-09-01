"""SQLite access. The database is temporary: it is deleted and recreated
from scratch every time the app starts."""

import sqlite3
from collections.abc import Iterator
from pathlib import Path

from .config import get_settings

_SCHEMA = """
CREATE TABLE users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
"""


def _db_path() -> Path:
    return get_settings().database_path


def connect() -> sqlite3.Connection:
    """Open a connection with row access by column name and foreign keys on."""
    conn = sqlite3.connect(_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    """Drop any existing database file and recreate the schema."""
    path = _db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.unlink(missing_ok=True)
    conn = connect()
    try:
        conn.executescript(_SCHEMA)
        conn.commit()
    finally:
        conn.close()


def get_connection() -> Iterator[sqlite3.Connection]:
    """FastAPI dependency: a connection that is committed and closed per request."""
    conn = connect()
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()
