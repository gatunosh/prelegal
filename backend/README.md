# Prelegal backend

FastAPI + SQLite. Proyecto uv, Python 3.13.

```bash
uv sync
uv run uvicorn app.main:app --reload   # http://localhost:8000
uv run pytest
```

## Layout

| Path | Proposito |
| --- | --- |
| `app/main.py` | App FastAPI: recrea la DB al arrancar, monta la API y el frontend estatico. |
| `app/config.py` | Settings desde el entorno. |
| `app/db.py` | Acceso SQLite; `init_db()` borra y recrea el schema. |
| `app/security.py` | Hash de contrasenas (argon2) y JWT. |
| `app/auth.py` | Endpoints `/api/auth/*`. |
| `app/schemas.py` | Modelos de request/response. |

La DB (`DATABASE_PATH`, por defecto `data/app.db`) se recrea desde cero en cada arranque.
El frontend compilado se sirve desde `STATIC_DIR` (por defecto `static/`) si existe.
