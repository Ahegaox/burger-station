from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers import auth, menu

app = FastAPI(
    title="The Burger Station API",
    version="0.1.0",
)

app.include_router(auth.router)
app.include_router(menu.router)

@app.get("/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "ok"}