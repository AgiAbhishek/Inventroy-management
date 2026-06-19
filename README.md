# Inventory & Order Management System

A full-stack inventory and order management system built with **FastAPI**, **React (TypeScript)**, and **PostgreSQL** — fully containerized with Docker Compose.

---

## Project Architecture

```
Inventory-management/
├── docker-compose.yml            # Orchestrates db + backend + frontend
├── .env.example                  # Environment variable template (copy → .env)
├── .gitignore
├── render.yaml                   # Render.com deployment config
│
├── backend/
│   ├── Dockerfile                # Multi-stage Python build, non-root user
│   ├── .dockerignore
│   ├── entrypoint.sh             # Runs migrations + seed, then starts uvicorn
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   │   └── versions/
│   │       ├── 001_initial_schema.py
│   │       └── 002_product_extra_fields.py
│   ├── app/
│   │   ├── main.py               # FastAPI app, CORS middleware, router includes
│   │   ├── core/config.py        # Pydantic Settings — reads env vars
│   │   ├── db/
│   │   │   ├── session.py        # SQLAlchemy engine + get_db dependency
│   │   │   └── seed.py           # Demo data inserted on first boot
│   │   ├── models/               # SQLAlchemy ORM models
│   │   │   ├── product.py
│   │   │   ├── customer.py
│   │   │   └── order.py          # Order + OrderItem (cascade delete)
│   │   ├── schemas/              # Pydantic request/response schemas
│   │   │   ├── product.py
│   │   │   ├── customer.py
│   │   │   └── order.py
│   │   └── api/
│   │       ├── errors.py         # IntegrityError → 409 JSON handler
│   │       └── routes/
│   │           ├── products.py
│   │           ├── customers.py
│   │           ├── orders.py     # Atomic stock deduction + restore on cancel
│   │           └── dashboard.py  # Summary stats + low-stock list
│   └── tests/
│       ├── conftest.py           # SQLite test DB override
│       └── test_*.py
│
└── frontend/
    ├── Dockerfile                # Multi-stage: node build → nginx:alpine serve
    ├── .dockerignore
    ├── nginx.conf                # SPA fallback (try_files → index.html)
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── main.tsx              # QueryClientProvider + Router entry
        ├── App.tsx               # Route definitions
        ├── index.css
        ├── vite-env.d.ts         # Vite env type declarations
        ├── lib/
        │   └── axios.ts          # Axios instance — reads VITE_API_BASE_URL
        ├── types/
        │   └── api.ts            # Backend types + snake_case → camelCase mappers
        ├── api/                  # Typed API call functions
        │   ├── products.ts
        │   ├── customers.ts
        │   ├── orders.ts
        │   └── dashboard.ts
        ├── hooks/                # TanStack Query hooks (cache + mutations)
        │   ├── useProducts.ts
        │   ├── useCustomers.ts
        │   ├── useOrders.ts
        │   └── useDashboard.ts
        ├── components/           # Reusable UI components
        │   ├── AddProductModal.tsx
        │   ├── CreateOrderModal.tsx
        │   └── ...
        └── pages/
            ├── Dashboard.tsx
            ├── Inventory.tsx
            ├── Orders.tsx
            └── Customers.tsx
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, SQLAlchemy 2, Alembic, Pydantic v2 |
| Database | PostgreSQL 16 |
| Frontend | React 18, TypeScript, Vite, Axios, TanStack Query |
| Styling | Tailwind CSS |
| Containerization | Docker, Docker Compose |
| Deployment | Render (backend), Vercel (frontend) |

---

## Quick Start

### Prerequisites
- Docker Desktop (includes Docker Compose)

### Run locally

```bash
# 1. Clone the repo
git clone <repo-url>
cd Inventory-management

# 2. Copy env template and edit if needed (ports, passwords)
cp .env.example .env

# 3. Build and start all services
docker compose up --build
```

- **Frontend:** http://localhost:3000
- **Backend API + Swagger UI:** http://localhost:8000/docs
- **Health check:** http://localhost:8000/health

> Ports default to `3000` (frontend) and `8000` (backend). Change them in `.env` if those ports are in use on your machine.

On first boot the backend automatically:
1. Runs all Alembic migrations (`alembic upgrade head`)
2. Seeds demo products, customers, and orders

### Stop and clean up

```bash
# Stop containers (keeps data volume)
docker compose down

# Full reset — removes containers, images, and DB volume
docker compose down -v --rmi all
```

---

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_PORT` | `8000` | Host port for the backend |
| `FRONTEND_PORT` | `3000` | Host port for the frontend |
| `POSTGRES_USER` | `postgres` | PostgreSQL username |
| `POSTGRES_PASSWORD` | `postgres` | PostgreSQL password |
| `POSTGRES_DB` | `inventory` | PostgreSQL database name |
| `CORS_ORIGINS` | `http://localhost:3000,...` | Comma-separated allowed origins |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend URL baked into frontend at build time |

---

## Running Tests

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest tests/ -v
```

Tests use an in-memory SQLite database — no Postgres required.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/dashboard/summary` | Stats + low-stock list |
| `POST` | `/products` | Create product |
| `GET` | `/products` | List all products |
| `GET` | `/products/{id}` | Get product by ID |
| `PUT` | `/products/{id}` | Update product |
| `DELETE` | `/products/{id}` | Delete product |
| `POST` | `/customers` | Create customer |
| `GET` | `/customers` | List all customers |
| `GET` | `/customers/{id}` | Get customer by ID |
| `DELETE` | `/customers/{id}` | Delete customer |
| `POST` | `/orders` | Create order (atomic stock deduction) |
| `GET` | `/orders` | List all orders |
| `GET` | `/orders/{id}` | Get order with line items |
| `DELETE` | `/orders/{id}` | Cancel order (restores stock) |

Full interactive docs available at `/docs` (Swagger UI) and `/redoc`.

---

## Business Rules

- **SKU** and **customer email** must be unique — returns `409` on conflict
- **Stock** can never go negative — enforced at DB level (`CHECK quantity >= 0`)
- **Create order** is fully atomic: if any line item exceeds available stock the entire order fails with `409` and no stock is deducted
- **Cancel order** restores stock for every line item
- **Order total** is auto-computed; unit prices are snapshotted at order time so historical totals don't change if product prices change later
- Low-stock threshold: products with quantity ≤ 10 appear in the dashboard warning list

---

## Deployment

### Backend → Docker Hub + Render

```bash
# 1. Build and push the backend image
docker build -t <dockerhub-username>/inventory-backend:latest backend/
docker push <dockerhub-username>/inventory-backend:latest
```

On **Render**:
1. Create a free **PostgreSQL** instance → copy the connection string
2. Create a **Web Service** → Docker image → `<dockerhub-username>/inventory-backend:latest`
3. Set environment variables:
   - `DATABASE_URL` — from Render Postgres
   - `CORS_ORIGINS` — your Vercel frontend URL
4. Health check path: `/health`

### Frontend → Vercel

1. Import this repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend/`
3. Build command: `npm run build` | Output: `dist`
4. Add environment variable: `VITE_API_BASE_URL=https://your-render-backend.onrender.com`

After both are deployed, add your Vercel URL to `CORS_ORIGINS` on Render and redeploy the backend.
