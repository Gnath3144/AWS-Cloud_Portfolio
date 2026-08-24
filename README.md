# Gopinath A — Cloud & Enterprise AI Architect Portfolio

[![Deploy to GitHub Pages](https://github.com/Gnath3144/AWS-Cloud_Portfolio/actions/workflows/pages.yml/badge.svg)](https://github.com/Gnath3144/AWS-Cloud_Portfolio/actions/workflows/pages.yml)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12-blue.svg?logo=python)](https://python.org)
[![AWS Architecture](https://img.shields.io/badge/AWS-Cloud%20Solutions%20Architect-FF9900.svg?logo=amazonaws)](https://aws.amazon.com)
[![AKEF Framework](https://img.shields.io/badge/AKEF-AI%20Knowledge%20Compiler-8b5cf6.svg)](https://github.com/Gnath3144/AKEF)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, high-performance Cloud & AI Architect portfolio showcasing multi-cloud lakehouse architectures, Infrastructure as Code (Terraform), deterministic knowledge compilers (AKEF), and 10+ years of technical consulting and pedagogy.

🌐 **Live Production Portfolio**: [https://gnath3144.github.io/AWS-Cloud_Portfolio/](https://gnath3144.github.io/AWS-Cloud_Portfolio/)  
🔐 **Content Studio & Agent Explorer**: [https://gnath3144.github.io/AWS-Cloud_Portfolio/admin/](https://gnath3144.github.io/AWS-Cloud_Portfolio/admin/)

---

## 🏛️ Architecture Overview

```
                      ┌──────────────────────────────────────────────┐
                      │             data/*.json                      │
                      │     Single Source of Truth (Master Data)     │
                      └──────────────────────┬───────────────────────┘
                                             │
                      ┌──────────────────────┴───────────────────────┐
                      ▼                                              ▼
        ┌───────────────────────────┐                  ┌───────────────────────────┐
        │  Public Portfolio Website │                  │   Admin Content Studio    │
        │  • Hero Developer Terminal│                  │   • Identity & Profile CMS│
        │  • 15-Tab Arch Explorer   │                  │   • Multi-Resume Manager  │
        │  • AKEF Compiler Center   │                  │   • Personal Asset Library│
        │  • Dynamic CMS Loader     │                  │   • Agent Knowledge Brain │
        │  • Mobile Drawer & Nav    │                  │   • 1-Click JSON Exporter │
        └─────────────┬─────────────┘                  └─────────────┬─────────────┘
                      │                                              │
                      │ 100% Free Static Ingress                     │ REST API Bridge
                      ▼                                              ▼
        ┌───────────────────────────┐                  ┌───────────────────────────┐
        │       GitHub Pages        │                  │      FastAPI Backend      │
        │    (Automated Actions)    │                  │   • SQLite / CSV Leadhub  │
        │                           │                  │   • PUT /api/admin/content│
        │                           │                  │   • POST /api/admin/upload│
        └───────────────────────────┘                  └───────────────────────────┘
```

---

## ✨ Key Capabilities & Systems

### 1. 🔍 15-Tab Dedicated Architecture Explorer
Deep-dive into 12 enterprise architectures with interactive SVG flowcharts, sequence diagrams, performance dashboards, and Infrastructure as Code (Terraform) modules:
- **AWS Serverless Medallion Lakehouse** (`aws-lakehouse`): S3 Bronze/Silver/Gold tiering, Glue 4.0, Snappy Parquet, and Athena analytics.
- **Zero-Trust Cloud Governance** (`security`): AWS GuardDuty, Least-Privilege IAM, SCPs, and TLS constraints.
- **Databricks Lakehouse** (`databricks`): Unity Catalog RBAC, Delta Lake ACID logs, and PySpark Structured Streaming.
- **AKEF Compiler** (`akef`): Deterministic 4-pass compiler converting Markdown into AST, Knowledge IR, Scene IR, and PowerPoint/PDF artifacts.
- **Stateful Multi-Agent AI** (`langgraph`): Parallel agent graph orchestration and SQLite checkpointers.

### 2. 💻 Interactive Developer Terminal
Type real cloud commands in the hero terminal to inspect live telemetry:
- `whoami` — Engineer dossier and availability
- `aws describe` — Configured multi-region AWS cloud infrastructure
- `terraform plan` — Preview Infrastructure as Code deployment plan
- `finops benchmark` — Quantified cost & latency savings (42% S3 tiering, 28% Graviton3, 67% BRIN)
- `lakehouse status` — Delta Lake stream ingestion health
- `akef --compile` — Multi-pass knowledge compiler demonstration

### 3. 👤 Content Studio & Agent Knowledge Explorer (`/admin/`)
A dedicated portal to manage your professional identity, tailored resume catalog, media assets, and structured AI agent knowledge base:
- **Profile & Identity Manager**: Update name, bio, social links, and telemetry counters.
- **Multi-Version Resume Manager**: Select which resume edition is active on the public website.
- **Media & Asset Library**: Drag-and-drop file upload with "Where Used" tracking.
- **Agent Knowledge Explorer**: Prompt sandbox generating role-tailored summaries and workshop syllabi grounded in your background.

---

## 🗂️ Single Source of Truth (`data/`)

All portfolio content is decoupled into clean JSON files:

```
AWS-Cloud_Portfolio/
│
├── data/
│   ├── profile.json            ← Identity, titles, bio, location, verified counters
│   ├── skills.json             ← Categorized skills matrix (Cloud, Lakehouse, AI, Pedagogy)
│   ├── experience.json         ← Career history & technical consulting leadership
│   ├── education.json          ← Academic background & degrees
│   ├── certifications.json     ← AWS, Databricks, Snowflake credentials
│   ├── projects.json           ← Flagship projects & architecture case studies
│   ├── services.json           ← Corporate FDP, Lakehouse Consulting, AI Advisories
│   ├── blog.json               ← Technical articles & markdown publications
│   ├── testimonials.json       ← Industry reviews & participant feedback
│   ├── website-settings.json   ← Global SEO, active resume pointer, feature toggles
│   └── architecture_details.json ← 15-tab blueprints with Terraform & FinOps data
│
├── images/                     ← Profile photos, architecture diagrams, social previews
├── downloads/                  ← Master resume PDFs and whitepapers
├── admin/                      ← Admin Content Studio & Agent Explorer
├── backend/                    ← FastAPI backend & SQLite lead repository
└── index.html                  ← Public Data-Driven Portfolio
```

---

## 🚀 Deployment Options

### Option A: 100% Free Static Hosting (GitHub Pages)

This repository includes [`.github/workflows/pages.yml`](.github/workflows/pages.yml) which automatically deploys the entire website on every commit to `main`.

1. Push your changes:
   ```bash
   git add .
   git commit -m "Update portfolio content"
   git push origin main
   ```
2. The GitHub Action automatically deploys to:  
   `https://<your-username>.github.io/<repo-name>/`

---

### Option B: Local Full-Stack Development (FastAPI + Python)

To run the full stack with live API endpoints, SQLite lead ingestion, and real disk persistence:

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start the FastAPI development server
python run_server.py
```
Open [http://localhost:8000](http://localhost:8000) for the portfolio and [http://localhost:8000/admin](http://localhost:8000/admin) for the Content Studio.

---

### Option C: Production Docker Deployment

```bash
# Build and start all services via Docker Compose
docker compose up -d --build
```

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
