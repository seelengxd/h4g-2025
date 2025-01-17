import os

from dotenv import load_dotenv

load_dotenv()


def _get_env_var(name: str, default: str | None = None, required: bool = True):
    value = os.getenv(name, default)
    if (value is None) and required:
        raise ValueError(f"{name} environment variable not defined")
    return value


DATABASE_URL: str = _get_env_var("DATABASE_URL")
SECRET_KEY: str = _get_env_var("SECRET_KEY", "", required=False)
FRONTEND_URL: str = _get_env_var("FRONTEND_URL", required=False)

GOOGLE_EMAIL: str = _get_env_var("GOOGLE_EMAIL")
GOOGLE_APP_PASSWORD: str = _get_env_var("GOOGLE_APP_PASSWORD")

BARCODE_API_KEY: str = _get_env_var("BARCODE_API_KEY")
