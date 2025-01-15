# MWH Minimart

## Instructions for set up

### Backend

#### Running the application

1. Install postgres.
2. `psql postgres`
3. Create the database: `CREATE DATABASE minimart;` and exit (ctrl+d)

4. Install [astral-uv](https://github.com/astral-sh/uv)
5. `cd backend`
6. `uv sync`

7. `cp backend/.env.example backend/.env`
8. `uv run alembic upgrade head`
9. `uv run seed.py`
10. `uv run fastapi dev src/app.py`

#### Modifying the database schema

1. Add a model. (Refer to any file named `models.py`)
2. Ensure it is imported at `backend/src/utils/models.py`
3. `uv run alembic revision --autogenerate -m "your message e.g. add model"`

### Frontend

```bash
cd frontend
cp frontend/.env.example frontend/.env
pnpm install
pnpm run dev
```
