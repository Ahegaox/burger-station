import json
from typing import Annotated

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    sendgrid_api_key: str | None = None
    sendgrid_from_email: str | None = None
    cors_origins: Annotated[list[str], NoDecode] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(env_file=".env")

    @field_validator("database_url")
    @classmethod
    def use_psycopg_driver(cls, value: str) -> str:
        # Los proveedores (Neon, Render...) entregan la URL como "postgresql://..."
        # o "postgres://...". SQLAlchemy necesita que indiquemos el driver psycopg.
        for prefix in ("postgresql://", "postgres://"):
            if value.startswith(prefix):
                return "postgresql+psycopg://" + value.removeprefix(prefix)
        return value

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        # Acepta una lista JSON ('["https://a.com"]') o URLs separadas por comas.
        if isinstance(value, str):
            value = value.strip()
            origins = json.loads(value) if value.startswith("[") else value.split(",")
        else:
            origins = value
        return [origin.strip().rstrip("/") for origin in origins if origin.strip()]


settings = Settings()
