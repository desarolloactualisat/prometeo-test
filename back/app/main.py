from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_routes, users_routes, documents_routes, bank_routes, chart_account_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://prometeodev.nlanube.mx"],  # Specify your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(users_routes.router)   
app.include_router(documents_routes.router)
app.include_router(bank_routes.router)
app.include_router(chart_account_routes.router)