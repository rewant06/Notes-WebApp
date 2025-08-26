# Keep Notes (Next.js + Django, Dockerized)

Stack
- Frontend: Next.js 14 (App Router), TypeScript, Zustand, Axios, Tailwind utilities only.
- Backend: Django 5.1, MySQL 8 (mysqlclient), Session Auth + CSRF.
- Proxy: Nginx. Orchestrated via Docker Compose.

Environment
- Frontend env: `infra/frontend.env` (NEXT_PUBLIC_API_BASE=/api)
- Backend env: `infra/backend.env` (DB settings, CSRF_TRUSTED_ORIGINS)

Run
1) Build and start
	docker compose up -d --build
2) Create migrations (first time only)
	docker compose run --rm server python manage.py makemigrations accounts notes
3) Apply migrations
	docker compose exec server python manage.py migrate
4) Optional admin user
	docker compose exec server python manage.py createsuperuser
5) Open app
	http://localhost

UI
- Top bar: brown (#7B3F00), links (Notes/Login/Register/Logout) in black.
- Greeting text is brown and time-aware (IST): Good Morning/Afternoon/Evening/Night Name!
- Forms: white input background, black input text.
- No UI component libraries; Tailwind utilities only.

Structure
- client/: Next.js app with Tailwind and Zustand.
- server/: Django project with custom User and notes CRUD.
- proxy/: Nginx config routing / to client and /api/ to server.
- infra/: env files.

Commands
- View logs
  docker compose logs -f server
  docker compose logs -f client
  docker compose logs -f proxy
- Recreate server container
  docker compose up -d --force-recreate server
- Stop stack
  docker compose down



Troubleshooting
- Port 3306 conflict: DB port is not exposed to host; backend connects over Docker network.
- 403/CSRF: ensure http://localhost is in CSRF_TRUSTED_ORIGINS; Axios uses withCredentials.
- Next dev over proxy: client binds 0.0.0.0 so Nginx can reach it.