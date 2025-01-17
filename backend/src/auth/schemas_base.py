from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

from src.auth.models import Role


class MiniUserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: Role
    full_name: str
    username: str
    image: str | None


class UserCreate(BaseModel):
    role: Role
    username: str
    full_name: str
    image: str | None = None


class UserUpdate(UserCreate):
    suspended: bool
    password: str | None = None
    points: int | None = None


class PasswordResetRequestData(BaseModel):
    email: EmailStr


class PasswordResetCompleteData(BaseModel):
    password: str = Field(min_length=6)
    confirm_password: str = Field(min_length=6)

    @model_validator(mode="after")
    def check_passwords_match(self):
        pw1 = self.password
        pw2 = self.confirm_password
        if pw1 is not None and pw2 is not None and pw1 != pw2:
            raise ValueError("passwords do not match")
        return self


class PasswordResetMoreCompleteData(PasswordResetCompleteData):
    old_password: str
