# MWH Minimart

## Instructions for set up

### Backend

#### Running the application

1. Install postgres.
2. `psql postgres`
3. Create the database: `CREATE DATABASE minimart;` and exit (ctrl+d)

4. Install [astral-uv](https://github.com/astral-sh/uv)
5. `uv sync`

6. `cp backend/.env.example backend/.env`
7. `uv run alembic upgrade head`
8. `uv run fastapi dev src/app.py`

#### Modifying the database schema

1. Add a model. (Refer to any file named `models.py`)
2. Ensure it is imported at `backend/src/utils/models.py`
3. `uv run alembic revision --autogenerate -m "your message e.g. add model"`

### Frontend

```bash
cp frontend/.env.example frontend/.env`
pnpm install
pnpm run dev
```
