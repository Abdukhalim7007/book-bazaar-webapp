import hashlib
import hmac
import os
import time
from urllib.parse import parse_qsl, unquote

from fastapi import HTTPException


def validate_telegram_init_data(init_data: str) -> dict:
    """
    Validate Telegram WebApp initData using HMAC-SHA256.
    Returns parsed user dict on success, raises HTTPException(401) on failure.
    """
    bot_token = os.getenv("BOT_TOKEN")
    if not bot_token:
        raise HTTPException(status_code=500, detail="BOT_TOKEN not configured")

    if not init_data:
        raise HTTPException(status_code=401, detail="Missing initData")

    parsed = dict(parse_qsl(init_data, keep_blank_values=True))

    received_hash = parsed.pop("hash", None)
    if not received_hash:
        raise HTTPException(status_code=401, detail="Missing hash in initData")

    # Validate auth_date — reject data older than 24 hours
    auth_date = parsed.get("auth_date")
    if not auth_date:
        raise HTTPException(status_code=401, detail="Missing auth_date in initData")

    if time.time() - int(auth_date) > 86400:
        raise HTTPException(status_code=401, detail="initData expired (older than 24 hours)")

    # Build data-check-string: sorted key=value pairs joined by \n (excluding hash)
    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(parsed.items())
    )

    # secret_key = HMAC-SHA256("WebAppData", bot_token)
    secret_key = hmac.new(
        b"WebAppData",
        bot_token.encode(),
        hashlib.sha256,
    ).digest()

    # expected_hash = HMAC-SHA256(secret_key, data_check_string)
    expected_hash = hmac.new(
        secret_key,
        data_check_string.encode(),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected_hash, received_hash):
        raise HTTPException(status_code=401, detail="Invalid initData signature")

    # Parse user JSON from the "user" field
    user_raw = parsed.get("user")
    if not user_raw:
        raise HTTPException(status_code=401, detail="No user data in initData")

    import json
    try:
        user = json.loads(unquote(user_raw))
    except (json.JSONDecodeError, ValueError):
        raise HTTPException(status_code=401, detail="Malformed user data in initData")

    return {
        "id": user.get("id"),
        "first_name": user.get("first_name", ""),
        "last_name": user.get("last_name", ""),
        "username": user.get("username", ""),
        "photo_url": user.get("photo_url", ""),
    }
