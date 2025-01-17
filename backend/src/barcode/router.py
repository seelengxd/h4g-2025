from fastapi import APIRouter
import requests

from src.barcode.schema import BarcodeResult
from src.common.constants import BARCODE_API_KEY

router = APIRouter(prefix="/barcode", tags=["barcode"])

scuffed_cache = {}


@router.get("/{barcode}")
def get_barcode(barcode: str) -> BarcodeResult:
    if barcode in scuffed_cache:
        return scuffed_cache[barcode]

    url = f"https://api.barcodelookup.com/v3/products?barcode={barcode}&formatted=y&key={BARCODE_API_KEY}"
    resp = requests.get(url)
    result = resp.json()["products"][0]
    image = result["images"][0] if result["images"] else None
    ret = {"name": result["title"], "image": image}

    scuffed_cache[barcode] = ret
    return ret
