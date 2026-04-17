from pydantic import BaseModel
from typing import List, Optional

class HoldingBase(BaseModel):
    symbol: str
    quantity: int
    avg_buy_price: float

class HoldingCreate(HoldingBase):
    pass

class Holding(HoldingBase):
    id: int
    portfolio_id: int
    class Config:
        from_attributes = True

class PortfolioBase(BaseModel):
    name: str

class PortfolioCreate(PortfolioBase):
    pass

class Portfolio(PortfolioBase):
    id: int
    holdings: List[Holding] = []
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str