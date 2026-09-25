from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise ValueError("El nombre debe tener al menos 2 caracteres")
        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.lower()

    @field_validator("password")
    @classmethod
    def check_password(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("La contraseña es demasiado larga")
        if not any(c.isalpha() for c in value) or not any(c.isdigit() for c in value):
            raise ValueError("La contraseña debe contener al menos una letra y un número")
        return value

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    created_at: datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.lower()

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"