import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from routes import router  # noqa: E402 — after load_dotenv so env vars are available

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="BookBazaar API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
async def startup_event():
    db_path = os.getenv("BOT_DB_PATH", "<not set>")
    logger.info(f"BOT_DB_PATH = {db_path}")
    if db_path != "<not set>" and os.path.exists(db_path):
        logger.info(f"Database file found: {db_path}")
    elif db_path != "<not set>":
        logger.warning(f"Database file NOT found at: {db_path}")
    else:
        logger.warning("BOT_DB_PATH is not set — DB-dependent routes will fail")
