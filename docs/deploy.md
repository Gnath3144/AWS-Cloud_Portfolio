# Production Deployment Guide: Enterprise AI Architect Platform

This document details the deployment, configuration, backup, and security operations for Gopinath's Enterprise Platform.

---

## 1. Environment Setup

Copy `.env.example` to `.env` and fill in secrets:

```bash
ADMIN_API_KEY=gopinath_secure_admin_key_2026
GITHUB_TOKEN=ghp_your_github_personal_access_token
RATE_LIMIT_REQUESTS=30
RATE_LIMIT_WINDOW_SECONDS=60
```

---

## 2. Docker Compose Local & Production Launch

Run the following command to build and launch containers:

```bash
docker-compose up -d --build
```

Verify service status:

```bash
docker-compose ps
```

---

## 3. Database Migration & SQLite Backups

The SQLite database (`database/portfolio.db`) stores telemetry, analytics sessions, and lead events.

Automated daily backup cron job example:

```bash
0 2 * * * cp /app/database/portfolio.db /app/database/backups/portfolio_$(date +%Y%m%d).db
```

---

## 4. HTTPS & Nginx Reverse Proxy Setup

Nginx is preconfigured in `nginx.conf` to serve as a reverse proxy in front of the FastAPI app (`app:8000`), terminating TLS/SSL using Let's Encrypt certificates.
