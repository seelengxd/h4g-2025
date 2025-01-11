import typer
from sqlalchemy.orm import Session
from src.auth.dependencies import get_password_hash
from src.auth.models import Role, User
from src.common.database import engine


def seed():
    # add users (1 admin 1 resident)
    with Session(engine) as session:
        admin = User(
            role=Role.ADMIN,
            username="admin",
            hashed_password=get_password_hash("admin"),
            full_name="Admin",
        )
        resident = User(
            role=Role.RESIDENT,
            username="resident",
            hashed_password=get_password_hash("resident"),
            full_name="Resident",
        )
        session.add_all([admin, resident])
        session.commit()


if __name__ == "__main__":
    typer.run(seed)
