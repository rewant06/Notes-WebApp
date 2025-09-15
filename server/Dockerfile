# Stage 1: Build dependencies in a temporary environment
FROM python:3.12-slim AS builder

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Install system dependencies needed for psycopg2 (PostgreSQL)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---
# Stage 2: Create the final, lean production image
FROM python:3.12-slim

WORKDIR /app

# Copy only the installed packages from the builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages

# Copy your application code
COPY . .

EXPOSE 8000

# Run the application using Gunicorn
CMD ["gunicorn", "core.wsgi.application", "--bind", "0.0.0.0:8000"]