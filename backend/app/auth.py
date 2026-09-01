"""Auth endpoints: register, login, and the current-user lookup."""

import sqlite3
from typing import Annotated

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .db import get_connection
from .schemas import Credentials, Token, UserOut
from .security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

_bearer = HTTPBearer(auto_error=True)

Connection = Annotated[sqlite3.Connection, Depends(get_connection)]


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(body: Credentials, conn: Connection) -> UserOut:
    try:
        cursor = conn.execute(
            "INSERT INTO users (email, password_hash) VALUES (?, ?)",
            (body.email, hash_password(body.password)),
        )
    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    return UserOut(id=cursor.lastrowid, email=body.email)


@router.post("/login", response_model=Token)
def login(body: Credentials, conn: Connection) -> Token:
    row = conn.execute(
        "SELECT id, password_hash FROM users WHERE email = ?", (body.email,)
    ).fetchone()
    if row is None or not verify_password(body.password, row["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    return Token(access_token=create_access_token(str(row["id"])))


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(_bearer)],
    conn: Connection,
) -> UserOut:
    invalid = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        user_id = int(decode_access_token(credentials.credentials))
    except (jwt.InvalidTokenError, ValueError):
        raise invalid
    row = conn.execute(
        "SELECT id, email FROM users WHERE id = ?", (user_id,)
    ).fetchone()
    if row is None:
        raise invalid
    return UserOut(id=row["id"], email=row["email"])


@router.get("/me", response_model=UserOut)
def me(user: Annotated[UserOut, Depends(get_current_user)]) -> UserOut:
    return user
