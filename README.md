# prelegal

Plataforma para redactar acuerdos legales comunes a partir de plantillas.

## Arquitectura

- `backend/` — API FastAPI (proyecto uv, Python 3.13). Sirve tambien el frontend compilado.
- `frontend/` — Next.js 16 (export estatico). Prototipo "Mutual NDA Creator".
- `templates/` + `catalog.json` — plantillas legales de Common Paper (CC BY 4.0).
- `Dockerfile` + `docker-compose.yml` — empaquetan todo en un contenedor en el puerto 8000.

La base de datos es SQLite y se **recrea desde cero en cada arranque** del contenedor.

## Arrancar y parar

```bash
# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# macOS
scripts/start-mac.sh
scripts/stop-mac.sh
```

```powershell
# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```

App disponible en http://localhost:8000

## API

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/health` | Estado del servicio |
| POST | `/api/auth/register` | Registro con `{email, password}` |
| POST | `/api/auth/login` | Login; devuelve un JWT bearer |
| GET | `/api/auth/me` | Usuario actual (requiere `Authorization: Bearer`) |

## Desarrollo

```bash
# Backend
cd backend
uv sync
uv run uvicorn app.main:app --reload   # http://localhost:8000
uv run pytest

# Frontend
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # genera out/ (export estatico)
```

Configuracion por variables de entorno (ver `.env.example`): `JWT_SECRET`,
`OPENROUTER_API_KEY`.
