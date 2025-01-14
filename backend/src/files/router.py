import os
from uuid import uuid4
from fastapi import APIRouter, UploadFile


router = APIRouter(prefix="/files", tags=["files"])


@router.post("")
async def create_file(file: UploadFile):
    filename = f"{str(uuid4())}____{file.filename}"

    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    with open(os.path.join("uploads", filename), "wb") as f:
        f.write(await file.read())

    return filename
