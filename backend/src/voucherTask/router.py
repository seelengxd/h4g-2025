from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from src.audit_logs.models import AuditLog
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.voucherTask.models import VoucherTask, TaskUser
from src.voucherTask.schemas import  MiniVoucherTaskPublic, VoucherTaskCreate, VoucherTaskUpdate, MiniTaskUserPublic


router = APIRouter(prefix="/voucherTasks", tags=["voucherTasks"])


@router.get("/")
def get_all_voucherTasks(
    session: Annotated[Session, Depends(get_session)],
) -> list[MiniVoucherTaskPublic]:
    voucherTasks = session.scalars(select(VoucherTask).order_by(VoucherTask.id.desc())).all()
    return voucherTasks


@router.get("/{voucherTask_id}")
def get_voucherTask(
    voucherTask_id: int,
    session: Annotated[Session, Depends(get_session)],
) -> MiniVoucherTaskPublic:
    query = (
        select(VoucherTask)
        .where(VoucherTask.id == voucherTask_id)
        .options(
            selectinload(VoucherTask.points, VoucherTask.task_name)
        )
    )
    
    voucherTask = session.scalar(query)
    if not voucherTask:
        raise HTTPException(status_code=404, detail="Voucher Task not found")

    return voucherTask


@router.post("/")
def create_voucherTask(
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
    data: VoucherTaskCreate,
):
    # If the user is admin, allow this action, else forbidden.
    if not user.role.is_staff():
        raise HTTPException(status_code=403, detail="Forbidden")
    
    voucherTask = VoucherTask(task_name=data.task_name, points=data.points) 

    session.add(voucherTask)
    session.add(user)
    session.commit()
    session.refresh(voucherTask)

    voucherTask_log = AuditLog(
        parent_type="voucher",
        parent_id=voucherTask.id,
        user_id=user.id,
        action=f"{user.full_name} created the voucher task.",
    )
    session.add(voucherTask_log)
    session.commit()

    return voucherTask


@router.patch("/{voucherTask_id}")
def update_voucherTask(
    session: Annotated[Session, Depends(get_session)],
    voucherTask_id: int,
    data: VoucherTaskUpdate,
    user: Annotated[User, Depends(get_current_user)],
):
    """Points or task name may be updated"""
    voucherTask = session.scalar(
        select(VoucherTask)
        .where(VoucherTask.id == voucherTask_id)
        .options(selectinload(VoucherTask.points, VoucherTask.task_name))
    )
    if not voucherTask:
        raise HTTPException(status_code=404, detail="Voucher Task not found")

    # If the user is admin, allow this action, else forbidden.
    if not user.role.is_staff():
        raise HTTPException(status_code=403, detail="Forbidden")

    voucherTask_log = AuditLog(
        parent_type="voucher",
        parent_id=voucherTask.id,
        user_id=user.id,
        action=f"{user.full_name} changed voucher task {voucherTask.task_name}: {voucherTask.points} to {data.task_name}: {data.points}.",
    )
    session.add(voucherTask_log)

    voucherTask.points = data.points
    voucherTask.task_name = data.task_name
    # no checks for admin adding negative points task, could be useful for punishments?

    session.commit()
    session.refresh(voucherTask)

    return voucherTask



## ------------ task user table ------------ ##
@router.get("/")
def get_all_tasksUsers(
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
) -> list[MiniTaskUserPublic]:
    
    if not user.role.is_staff():
        raise HTTPException(status_code=403, detail="Forbidden")
    
    tasksUsers = session.scalars(select(TaskUser).order_by(TaskUser.id.desc())).all()
    return tasksUsers

@router.get("/{voucherTask_id}")
def get_taskUsers(
    voucherTask_id: int,
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
) -> MiniTaskUserPublic:
    
    if not user.role.is_staff():
        raise HTTPException(status_code=403, detail="Forbidden")
    
    query = (
        select(TaskUser)
        .where(TaskUser.task_id == voucherTask_id)
        .options(
            selectinload(TaskUser.task_id, TaskUser.user_id)
        )
    )
    
    taskUsers = session.scalar(query)
    if not taskUsers:
        raise HTTPException(status_code=404, detail="Task does not exist or has no users.")

    return taskUsers


@router.get("/{user_id}")
def get_UserTasks(
    user_id: int,
    session: Annotated[Session, Depends(get_session)],
) -> MiniTaskUserPublic:
    
    query = (
        select(TaskUser)
        .where(TaskUser.user_id == user_id)
        .options(
            selectinload(TaskUser.task_id, TaskUser.user_id)
        )
    )
    
    userTasks = session.scalar(query)
    if not userTasks:
        raise HTTPException(status_code=404, detail="User does not exist or has no tasks.")

    return userTasks