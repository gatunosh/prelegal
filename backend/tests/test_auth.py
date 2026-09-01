from app.config import get_settings
from app.db import connect

CREDS = {"email": "alice@example.com", "password": "s3cret-pass"}


def test_register_returns_user(client):
    response = client.post("/api/auth/register", json=CREDS)
    assert response.status_code == 201
    body = response.json()
    assert body["email"] == CREDS["email"]
    assert isinstance(body["id"], int)


def test_register_duplicate_email_conflicts(client):
    client.post("/api/auth/register", json=CREDS)
    response = client.post("/api/auth/register", json=CREDS)
    assert response.status_code == 409


def test_register_rejects_short_password(client):
    response = client.post(
        "/api/auth/register", json={"email": "bob@example.com", "password": "short"}
    )
    assert response.status_code == 422


def test_login_returns_token(client):
    client.post("/api/auth/register", json=CREDS)
    response = client.post("/api/auth/login", json=CREDS)
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


def test_login_wrong_password_unauthorized(client):
    client.post("/api/auth/register", json=CREDS)
    response = client.post(
        "/api/auth/login", json={"email": CREDS["email"], "password": "wrong-pass"}
    )
    assert response.status_code == 401


def test_login_unknown_user_unauthorized(client):
    response = client.post("/api/auth/login", json=CREDS)
    assert response.status_code == 401


def test_me_with_token_returns_current_user(client):
    client.post("/api/auth/register", json=CREDS)
    token = client.post("/api/auth/login", json=CREDS).json()["access_token"]
    response = client.get(
        "/api/auth/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == CREDS["email"]


def test_me_without_token_unauthorized(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401  # no Authorization header at all


def test_me_with_garbage_token_unauthorized(client):
    response = client.get(
        "/api/auth/me", headers={"Authorization": "Bearer not-a-jwt"}
    )
    assert response.status_code == 401


def test_database_is_recreated_between_lifespans(client):
    """Data from one startup must not survive into the next."""
    client.post("/api/auth/register", json=CREDS)

    # A fresh lifespan (new "with TestClient") runs init_db again.
    from app.main import app
    from fastapi.testclient import TestClient

    with TestClient(app) as fresh:
        response = fresh.post("/api/auth/login", json=CREDS)
        assert response.status_code == 401


def test_init_db_creates_only_the_users_table(client):
    db_path = get_settings().database_path
    assert db_path.exists()
    conn = connect()
    try:
        tables = {
            row["name"]
            for row in conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            )
        }
    finally:
        conn.close()
    assert "users" in tables
