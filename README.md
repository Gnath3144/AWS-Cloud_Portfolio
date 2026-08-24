# Gopinath A — Cloud & Enterprise AI Architect Portfolio

[![Deploy to GitHub Pages](https://github.com/Gnath3144/AWS-Cloud_Portfolio/actions/workflows/pages.yml/badge.svg)](https://github.com/Gnath3144/AWS-Cloud_Portfolio/actions/workflows/pages.yml)
[![Run Portfolio Test Suite](https://github.com/Gnath3144/AWS-Cloud_Portfolio/actions/workflows/test.yml/badge.svg)](https://github.com/Gnath3144/AWS-Cloud_Portfolio/actions/workflows/test.yml)
[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12-blue.svg?logo=python)](https://python.org)
[![AWS Architecture](https://img.shields.io/badge/AWS-Cloud%20Solutions%20Architect-FF9900.svg?logo=amazonaws)](https://aws.amazon.com)
[![AKEF Framework](https://img.shields.io/badge/AKEF-AI%20Knowledge%20Compiler-8b5cf6.svg)](https://github.com/Gnath3144/AKEF)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, high-performance Cloud & AI Architect portfolio showcasing multi-cloud lakehouse architectures, Infrastructure as Code (Terraform), deterministic knowledge compilers (AKEF), and 10+ years of technical consulting and pedagogy.

🌐 **Live Production Portfolio**: [https://gnath3144.github.io/AWS-Cloud_Portfolio/](https://gnath3144.github.io/AWS-Cloud_Portfolio/)  
📖 **Content Maintenance Guide**: [`CONTENT_DATABASE_GUIDE.md`](CONTENT_DATABASE_GUIDE.md)  
🔍 **Content Migration Audit**: [`CONTENT_MIGRATION_AUDIT.md`](CONTENT_MIGRATION_AUDIT.md)

---

## 🏛️ Architecture: Zero-Server Content Database

This portfolio runs 100% serverless on **GitHub Pages**. There is no admin portal, no database server, and no server maintenance required. You manage all portfolio content directly inside **VS Code** using clean JSON files:

```
YOU (in VS Code)
      │
      ▼ (Edit JSON & manage assets)
data/portfolio/*.json  +  assets/*
      │
      ▼ (Git Commit & Push)
GitHub Repository (main branch)
      │
      ▼ (Automated GitHub Actions CI/CD)
GitHub Pages Live Website (Free Static Ingress)
```

### Core Principle: `NO DATA = NO INVENTION`
If a field is empty or marked `"published": false`, the public website cleanly hides the optional component or renders a safe neutral fallback.

---

## 🗂️ Content Database Structure (`data/portfolio/`)

```
AWS-Cloud_Portfolio/
│
├── data/
│   └── portfolio/
│       ├── profile.json            ← Identity, titles, bio, location, verified counters
│       ├── about.json              ← Career story, biography paragraphs, core pillars
│       ├── contact.json            ← Email, phone, advisory types, response time
│       ├── social.json             ← GitHub, LinkedIn, email links
│       ├── skills.json             ← Categorized skills matrix (Cloud, Lakehouse, AI, Pedagogy)
│       ├── experience.json         ← Professional career timeline & achievements
│       ├── education.json          ← Academic degrees, institution & focus areas
│       ├── projects.json           ← Flagship projects & architecture case studies
│       ├── certifications.json     ← AWS, Databricks, Snowflake credentials
│       ├── services.json           ← Corporate FDP, Lakehouse Consulting, AI Advisories
│       ├── testimonials.json       ← Industry reviews & participant feedback
│       ├── training.json           ← Corporate bootcamps & workshop syllabi
│       ├── blog.json               ← Technical articles & markdown publications
│       ├── architecture.json       ← 15-tab blueprints with Terraform & FinOps data
│       ├── downloads.json          ← Whitepapers & downloadable dossier catalog
│       ├── assets.json             ← Central media asset registry
│       └── settings.json           ← Global site metadata & active resume pointer
│
├── assets/                         ← Structured asset folders (profile, projects, certificates, resume)
├── js/
│   └── data-service.js             ← Central resilient data service for public website
└── index.html                      ← Public Data-Driven Portfolio
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

---

## 🚀 How to Update & Deploy

Whenever you edit files in `data/portfolio/` or add files to `assets/`:

```bash
# 1. Stage changes
git add .

# 2. Commit
git commit -m "Update skills and add new project"

# 3. Push to GitHub
git push origin main
```
GitHub Actions will automatically run the test suite and publish the updated site live.

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
