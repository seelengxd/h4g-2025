from typing import Annotated

from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from src.common.dependencies import get_session
from src.voucher_task.models import TaskUser, VoucherTask


def retrieve_task(
    task_id: int,
    session: Annotated[Session, Depends(get_session)],
) -> VoucherTask:
    task = session.scalar(
        select(VoucherTask)
        .where(VoucherTask.id == task_id)
        .where(VoucherTask.hidden == False)  # noqa: E712
        .options(selectinload(VoucherTask.task_users, TaskUser.user))
    )

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task
