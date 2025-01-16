"""empty message

Revision ID: 06a63fcb638f
Revises: 161a97827e00, b406ab451e05
Create Date: 2025-01-16 16:03:44.357567

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '06a63fcb638f'
down_revision: Union[str, None] = ('161a97827e00', 'b406ab451e05')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
