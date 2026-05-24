import os
import sqlite3
from contextlib import asynccontextmanager

import aiosqlite


def get_db_path() -> str:
    path = os.getenv("BOT_DB_PATH")
    if not path:
        raise RuntimeError("BOT_DB_PATH environment variable is not set")
    return path


@asynccontextmanager
async def get_db():
    """Async context manager yielding an aiosqlite connection to the bot's SQLite DB."""
    db_path = get_db_path()
    async with aiosqlite.connect(db_path) as conn:
        conn.row_factory = aiosqlite.Row
        await conn.execute("PRAGMA journal_mode=WAL")
        await conn.execute("PRAGMA foreign_keys=ON")
        yield conn
