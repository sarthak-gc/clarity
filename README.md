# Project Setup

This guide explains how to set up the **frontend** and **backend** of the Clarity project locally.

---

## Prerequisites

- Node.js installed (>=16 recommended)
- Package manager: **pnpm**, **yarn**, or **npm** (pick one)
- PostgreSQL installed and running
- `serve` CLI (for serving frontend build):

```bash
npm install -g serve
```

---

## 1. Clone the repository

```bash
git clone https://github.com/sarthak-gc/clarity
cd clarity
```

---

## 2. Frontend Setup

```bash
cd frontend

# Copy environment variables
cp .env.example .env
# Edit .env if needed
# Typically, BACKEND_URL should point to your backend, e.g.,
# BACKEND_URL="http://localhost:3000"

# Install dependencies (choose ONE)
pnpm install
# or
# yarn install
# or
# npm install


# Build the frontend
pnpm run build
# or yarn build
# or npm run build

# Serve the built files
cd dist
serve . -l 5173

# or you can directly run it in dev mode with

# pnpm run dev
```

- Open your browser at: [http://localhost:5173](http://localhost:5173)
- You should see the **login page**.

---

## 3. Backend Setup

```bash
cd ../backend  # navigate back to repo root and then to backend

# Copy environment variables
cp .env.example .env
# Edit .env based on your database
# Example:
# DATABASE_URL="postgresql://postgres:clarity@localhost:5432/clarity"
# FRONTEND_URL="http://localhost:5173"

# Install dependencies (choose ONE)
pnpm install
# or
# yarn install
# or
# npm install

# Build the backend
pnpm run build
# or yarn build
# or npm run build

# Run database migrations
pnpm run db:migrate

# Start the backend server
pnpm run start
```

- The backend will typically run at: [http://localhost:3000](http://localhost:3000)

---

## Notes

- Ensure your frontend `.env` `BACKEND_URL` points to the running backend server.
- You can also run the frontend in development mode with:

```bash
pnpm run dev
```

instead of using serve
