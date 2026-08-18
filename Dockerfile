# Multi-stage Dockerfile for Enterprise AI Architect Platform
FROM python:3.11-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Final Runtime Image
FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /install /usr/local
COPY . /app

EXPOSE 8000

ENV PYTHONUNBUFFERED=1

CMD ["python", "run_server.py"]
