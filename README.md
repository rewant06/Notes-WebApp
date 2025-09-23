# Notes WebApp (Next.js + Django)

A simple notes application with a Next.js frontend, Django backend, and Nginx reverse proxy. Local development runs via Docker Compose; production deploys via AWS ECS/Fargate with images stored in ECR.

## Architecture

- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind (utility classes only)
- Backend: Django 5.1 + Gunicorn
- Database (local): Postgres 16 (via Docker)
- Reverse proxy: Nginx (routes / to Next app, /api/ to Django)
- Containerization: Docker, multi-stage images
- CI/CD: GitHub Actions → ECR → ECS (task definition update)

## Prerequisites

- Docker and Docker Compose V2
- Node 20+ (only if you run the client without Docker)
- Python 3.12+ (only if you run the server without Docker)

## Environment configuration

Local env files are git-ignored. Copy the examples and provide local values:

- Frontend: `infra/frontend.env.example` → `infra/frontend.env`
- Backend: `infra/backend.env.example` → `infra/backend.env`

Do NOT commit real secrets. For production:

- CI/CD (GitHub Actions): store AWS/ECR/ECS settings in GitHub Secrets and reference as `${{ secrets.* }}`.
- Runtime (ECS): inject app secrets from AWS Secrets Manager or SSM Parameter Store in the ECS task definition.

## Quick start (Docker)

1) Build and start
```bash
docker compose up -d --build
```

2) Run migrations (first time)
```bash
docker compose run --rm server python manage.py makemigrations accounts notes
docker compose exec server python manage.py migrate
```

3) Create admin user (optional)
```bash
docker compose exec server python manage.py createsuperuser
```

4) Open the app

- Next.js: http://localhost:3000
- API: http://localhost:8000
- Through Nginx: http://localhost/

## Project structure

- `client/` — Next.js app; builds to standalone runtime for smaller images
- `server/` — Django project; served by Gunicorn
- `proxy/` — Nginx config (routes / to client and /api/ to server)
- `infra/` — local environment files (templates: `*.example`)

## Useful commands

- Rebuild a service
```bash
docker compose build server
docker compose up -d server
```

- Tail logs
```bash
docker compose logs -f server
docker compose logs -f client
docker compose logs -f proxy
```

- Stop everything
```bash
docker compose down
```

## CI/CD (AWS ECS)

- Recommended workflow updates the ECS task definition with the new image and waits for stability.
- Use OIDC (short-lived credentials) instead of long-lived AWS keys when possible.
- Required GitHub Secrets (example):
	- `AWS_REGION`, `AWS_ROLE_TO_ASSUME` (or `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`)
	- `ECR_REPOSITORY`, `ECS_CLUSTER`, `ECS_SERVICE`, `ECS_TASK_DEFINITION`, `CONTAINER_NAME`

## Database

Local development uses Postgres to match the `psycopg2-binary` driver in `requirements.txt`.
If you prefer MySQL, switch the compose DB service and Python deps to `mysqlclient` and install the required dev packages in the server image.

## Troubleshooting

- 403/CSRF from API:
	- Ensure `http://localhost` is included in `CSRF_TRUSTED_ORIGINS` in `infra/backend.env`.
	- Make sure the client sends credentials if needed.

- Next.js build fails copying `public`:
	- The Dockerfile ensures `public/` exists; if you rely on assets, create `client/public/`.

- Cannot reach API through Nginx:
	- Confirm `proxy/ngnix/nginx.conf` volume path matches the actual folder name and that services are healthy.

## Security

- `.env` and `infra/*.env` are ignored by git. Use `*.example` templates.
- Never commit credentials. Rotate any previously committed secrets immediately.
- Prefer OIDC for GitHub→AWS auth; use AWS Secrets Manager/SSM for runtime secrets.


