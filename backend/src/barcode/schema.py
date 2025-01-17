from pydantic import BaseModel


class BarcodeResult(BaseModel):
    name: str
    image: str
