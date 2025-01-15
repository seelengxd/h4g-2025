"""This file is for loading models into alembic."""

from src.auth import models  # noqa: F401
from src.products import models  # noqa: F401
from src.orders import models  # noqa: F401
from src.audit_logs import models  # noqa: F401
from src.auctions import models  # noqa: F401

from src.voucherTask import models
from src.transactions import models
from src.reports import models