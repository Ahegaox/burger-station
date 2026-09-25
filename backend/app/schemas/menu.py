from pydantic import BaseModel, ConfigDict

class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    price: float
    category: str

class MenuRules(BaseModel):
    max_extras: int
    max_sauces: int

class MenuOut(BaseModel):
    burgers: list[ProductOut]
    extras: list[ProductOut]
    sauces: list[ProductOut]
    sides: list[ProductOut]
    drinks: list[ProductOut]
    rules: MenuRules