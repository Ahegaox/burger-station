from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.core.security import decode_access_token
from app.database import get_db
from app.models import User

bearer_scheme = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o caducado",
        headers={"WWW-Authenticate": "Bearer"},
    )

    user_id = decode_access_token(credentials.credentials)
    if user_id is None:
        raise unauthorized

    user = db.get(User, int(user_id))
    if user is None:
        raise unauthorized

    return user