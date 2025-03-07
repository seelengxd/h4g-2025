from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.transactions.models import Transaction
from src.voucher_task.dependencies import retrieve_task
from src.voucher_task.models import RequestState, TaskUser, VoucherTask
from src.voucher_task.schema import (
    ApprovalUpdate,
    VoucherTaskCreate,
    VoucherTaskJoinRequest,
    MiniVoucherTaskPublic,
    VoucherTaskPublic,
    VoucherTaskRequestCreate,
    VoucherTaskUpdate,
)


router = APIRouter(prefix="/voucher_task", tags=["voucher_task"])


@router.get("/")
def get_all_tasks(
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
) -> list[MiniVoucherTaskPublic]:
    query = (
        select(VoucherTask)
        .where(VoucherTask.hidden == False)  # noqa: E712
        .options(selectinload(VoucherTask.task_users, TaskUser.user))
    )

    tasks = session.scalars(query).all()
    return tasks


@router.get("/{task_id}")
def get_task(
    task_id: int,
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
) -> VoucherTaskPublic:
    # showtask (return task details, past requests, active ones)
    task = session.scalar(
        select(VoucherTask)
        .where(VoucherTask.id == task_id)
        .where(VoucherTask.hidden == False)  # noqa: E712
        .options(
            selectinload(VoucherTask.task_users, TaskUser.user),
            selectinload(VoucherTask.task_users, TaskUser.transactions),
        )
    )

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


@router.post("/")
def add_task(
    data: VoucherTaskCreate,
    session: Annotated[Session, Depends(get_session)],
) -> MiniVoucherTaskPublic:
    task = VoucherTask(
        task_name=data.task_name, points=data.points, description=data.description
    )
    if data.task_users:
        task.task_users = [
            TaskUser(user_id=user_id, state=RequestState.PENDING)
            for user_id in data.task_users
        ]
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.put("/{task_id}")
def update_task(
    data: VoucherTaskUpdate,
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
    task: Annotated[MiniVoucherTaskPublic, Depends(retrieve_task)],
) -> MiniVoucherTaskPublic:
    if not user.role.is_staff():
        raise HTTPException(status_code=403, detail="Forbidden")

    task.update(**data.model_dump())
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/{task_id}")
def delete_task(
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
    task: Annotated[MiniVoucherTaskPublic, Depends(retrieve_task)],
):
    """This only hides the task."""

    if not user.role.is_staff():
        raise HTTPException(status_code=403, detail="Forbidden")

    task.hidden = True
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.post("/{task_id}/requests/join")
def join_request(
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
    task: Annotated[MiniVoucherTaskPublic, Depends(retrieve_task)],
    data: VoucherTaskJoinRequest,
):
    task_user = TaskUser(
        user_id=user.id, state=RequestState.PENDING, justification=data.justification
    )
    task.task_users.append(task_user)
    session.add(task_user)
    session.commit()
    return task


@router.post("/{task_id}/requests")
def add_request(
    task: Annotated[MiniVoucherTaskPublic, Depends(retrieve_task)],
    session: Annotated[Session, Depends(get_session)],
    data: VoucherTaskRequestCreate,
):
    task_users = [
        TaskUser(user_id=user_id, state=data.state, justification=data.justification)
        for user_id in data.user_ids
    ]
    task.task_users.extend(task_users)
    session.add(task)
    session.flush()

    if data.state == RequestState.APPROVED:
        for task_user in task_users:
            task_user.user.points += task.points
            transaction = Transaction(
                user_id=task_user.user_id,
                amount=task.points,
                parent_id=task_user.id,
                parent_type="task_user",
            )
            session.add(transaction)
            session.add(task_user)

    session.commit()
    return task


@router.put("/{task_id}/requests/approve")
def approve_requests(
    task: Annotated[MiniVoucherTaskPublic, Depends(retrieve_task)],
    session: Annotated[Session, Depends(get_session)],
    data: ApprovalUpdate,
):
    for task_user in task.task_users:
        if task_user.id in data.task_user_ids:
            task_user.state = RequestState.APPROVED
            task_user.user.points += task.points
            transaction = Transaction(
                user_id=task_user.user_id,
                amount=task.points,
                parent_id=task_user.id,
                parent_type="task_user",
            )
            session.add(transaction)
            session.add(task_user)
    session.commit()
    return task


@router.put("/{task_id}/requests/reject")
def reject_requests(
    task: Annotated[MiniVoucherTaskPublic, Depends(retrieve_task)],
    session: Annotated[Session, Depends(get_session)],
    data: ApprovalUpdate,
):
    for task_user in task.task_users:
        if task_user.id in data.task_user_ids:
            task_user.state = RequestState.REJECTED
            session.add(task_user)
    session.commit()


@router.put("/{task_id}/requests/unapprove")
def unapprove_requests(
    task: Annotated[MiniVoucherTaskPublic, Depends(retrieve_task)],
    session: Annotated[Session, Depends(get_session)],
    data: ApprovalUpdate,
):
    for task_user in task.task_users:
        if task_user.id in data.task_user_ids:
            task_user.state = RequestState.PENDING
            task_user.user.points -= task.points
            transaction = Transaction(
                user_id=task_user.user_id,
                amount=-task.points,
                parent_id=task_user.id,
                parent_type="task_user",
            )
            session.add(transaction)
            session.add(task_user)
    session.commit()


@router.put("/{task_id}/requests/unreject")
def unreject_requests(
    task: Annotated[MiniVoucherTaskPublic, Depends(retrieve_task)],
    session: Annotated[Session, Depends(get_session)],
    data: ApprovalUpdate,
):
    for task_user in task.task_users:
        if task_user.id in data.task_user_ids:
            task_user.state = RequestState.PENDING
            session.add(task_user)
    session.commit()
