import os
from urllib.parse import urlparse, parse_qs
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent

# Loaded from AWS secrets manager
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-secret")
DB_NAME = os.environ.get("DB_NAME")
DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
DB_HOST = os.environ.get("DB_HOST")
DB_PORT = os.environ.get("DB_PORT")

DEBUG = os.environ.get("DJANGO_DEBUG", "0") == "1"
ALLOWED_HOSTS = [h.strip() for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "*").split(",") if h.strip()]


INSTALLED_APPS = [
    "django.contrib.admin","django.contrib.auth","django.contrib.contenttypes",                                     
    "django.contrib.sessions","django.contrib.messages","django.contrib.staticfiles",
    "accounts","notes"                                                                                                                        
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = "core.urls"
TEMPLATES = [{
    "BACKEND":"django.template.backends.django.DjangoTemplates",
    "DIRS":[], "APP_DIRS":True,
    "OPTIONS":{"context_processors":[
        "django.template.context_processors.debug",
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]}
}]
WSGI_APPLICATION = "core.wsgi.application"

def _db_from_url(url: str):
    """Parse DATABASE_URL (e.g., postgresql://user:pass@host:5432/db?sslmode=require) into Django DATABASES['default']."""
    parsed = urlparse(url)
    engine_map = {
        "postgres": "django.db.backends.postgresql",
        "postgresql": "django.db.backends.postgresql",
        "postgresql+psycopg2": "django.db.backends.postgresql",
    }
    engine = engine_map.get(parsed.scheme)
    if not engine:
        raise ValueError(f"Unsupported DB scheme: {parsed.scheme}")
    name = parsed.path.lstrip("/")
    options = {k: v[0] for k, v in parse_qs(parsed.query).items()}
    return {
        "ENGINE": engine,
        "NAME": name,
        "USER": parsed.username,
        "PASSWORD": parsed.password,
        "HOST": parsed.hostname,
        "PORT": str(parsed.port) if parsed.port else None,
        "OPTIONS": options if options else {},
    }

DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL:
    DATABASES = {"default": _db_from_url(DATABASE_URL)}
else:
    # Fallback to discrete env vars
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": DB_NAME,
            "USER": DB_USER,
            "PASSWORD": DB_PASSWORD,
            "HOST": DB_HOST,
            "PORT": DB_PORT,
        }
    }

AUTH_USER_MODEL = "accounts.User"
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Production Security settings
CSRF_TRUSTED_ORIGINS = [o.strip() for o in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",") if o.strip()]
SESSION_COOKIE_SECURE = os.environ.get("SESSION_COOKIE_SECURE", "0") == "1"
CSRF_COOKIE_SECURE = os.environ.get("CSRF_COOKIE_SECURE", "0") == "1"
SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "0") == "1"
SECURE_HSTS_SECONDS = int(os.environ.get("SECURE_HSTS_SECONDS", "0" if not SECURE_SSL_REDIRECT else "31536000"))
SECURE_HSTS_INCLUDE_SUBDOMAINS = os.environ.get("SECURE_HSTS_INCLUDE_SUBDOMAINS", "1" if SECURE_SSL_REDIRECT else "0") == "1"
SECURE_HSTS_PRELOAD = os.environ.get("SECURE_HSTS_PRELOAD", "1" if SECURE_SSL_REDIRECT else "0") == "1"