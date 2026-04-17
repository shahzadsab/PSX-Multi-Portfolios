from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, auth, database
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal PSX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed Demo Data
@app.on_event("startup")
def startup_populate():
    try:
        db = next(get_db())
        demo_email = "demo@sabsoft.com"
        user = db.query(models.User).filter(models.User.email == demo_email).first()
        if not user:
            hashed_pw = auth.get_password_hash("demo123")
            demo_user = models.User(email=demo_email, hashed_password=hashed_pw)
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            
            # Create Portfolios
            p1 = models.Portfolio(name="Tech Stocks", user_id=demo_user.id)
            p2 = models.Portfolio(name="Energy", user_id=demo_user.id)
            db.add_all([p1, p2])
            db.commit()
            
            # Create Holdings
            h1 = models.Holding(portfolio_id=p1.id, symbol="SYS", quantity=500, avg_buy_price=85.2)
            h2 = models.Holding(portfolio_id=p1.id, symbol="NETSOL", quantity=200, avg_buy_price=150.5)
            h3 = models.Holding(portfolio_id=p2.id, symbol="HUBC", quantity=1000, avg_buy_price=125.0)
            h4 = models.Holding(portfolio_id=p2.id, symbol="MARI", quantity=300, avg_buy_price=210.3)
            db.add_all([h1, h2, h3, h4])
            db.commit()
    except Exception as e:
        print(f"Warning: Could not populate demo data: {e}")

# Auth Endpoints
@app.post("/auth/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user: raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    access_token = auth.create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# Portfolio Endpoints
@app.get("/portfolios", response_model=List[schemas.Portfolio])
def get_portfolios(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).all()

@app.post("/portfolios", response_model=schemas.Portfolio)
def create_portfolio(p: schemas.PortfolioCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    new_p = models.Portfolio(name=p.name, user_id=current_user.id)
    db.add(new_p)
    db.commit()
    db.refresh(new_p)
    return new_p

@app.delete("/portfolios/{id}")
def delete_portfolio(id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    
    p = db.query(models.Portfolio).filter(models.Portfolio.id == id, models.Portfolio.user_id == current_user.id).first()
    if not p: raise HTTPException(status_code=404)
    db.delete(p)
    db.commit()
    return {"message": "Deleted"}

@app.post("/portfolios/{id}/holdings", response_model=schemas.Holding)
def add_holding(id: int, h: schemas.HoldingCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    p = db.query(models.Portfolio).filter(models.Portfolio.id == id, models.Portfolio.user_id == current_user.id).first()
    if not p: raise HTTPException(status_code=404)
    new_h = models.Holding(**h.dict(), portfolio_id=id)
    db.add(new_h)
    db.commit()
    db.refresh(new_h)
    return new_h

@app.delete("/holdings/{id}")
def delete_holding(id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    h = db.query(models.Holding).join(models.Portfolio).filter(models.Holding.id == id, models.Portfolio.user_id == current_user.id).first()
    if not h: raise HTTPException(status_code=404)
    db.delete(h)
    db.commit()
    return {"message": "Deleted"}