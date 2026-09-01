"""Application settings, read from the environment (and an optional .env)."""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Secret used to sign JWTs. Override in every real deployment.
    jwt_secret: str = "dev-insecure-secret-change-me-0123456789abcdef"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # SQLite file. Recreated from scratch on every startup (see db.init_db).
    database_path: Path = Path("data/app.db")

    # Directory with the compiled frontend (index.html + assets). When it does
    # not exist the API still runs; only the static site is unavailable.
    static_dir: Path = Path("static")


@lru_cache
def get_settings() -> Settings:
    return Settings()
