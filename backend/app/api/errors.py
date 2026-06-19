from fastapi import Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError


async def integrity_error_handler(request: Request, exc: IntegrityError) -> JSONResponse:
    msg = str(exc.orig) if exc.orig else str(exc)
    if "sku" in msg.lower():
        detail = "A product with this SKU already exists."
    elif "email" in msg.lower():
        detail = "A customer with this email already exists."
    else:
        detail = "A unique constraint was violated."
    return JSONResponse(status_code=409, content={"detail": detail})
