from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    sendgrid_api_key: str | None = None
    sendgrid_from_email: str | None = None

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()