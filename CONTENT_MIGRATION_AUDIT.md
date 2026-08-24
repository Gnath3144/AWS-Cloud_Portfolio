# Portfolio Content Migration & Accuracy Audit

**Core Principle**: **NO DATA = NO INVENTION**

This audit reviews every professional claim, metric, and entity across the portfolio and classifies each into one of four verified tiers:
1. **VERIFIED**: Proven by codebase artifacts, open-source repositories, or verified professional history.
2. **NEEDS USER INPUT**: Real structure created; requires user to supply exact personal file or preference.
3. **PLACEHOLDER**: Structural asset placeholder (e.g. sample image or badge) cleanly replaceable by user.
4. **DEMO CONTENT**: Interactive simulation data (e.g. SQL unindexed vs indexed timing demo).

---

## 📊 Content Classification Audit Table

| Entity / Section | Field / Claim | Classification | Source File & Status |
| :--- | :--- | :---: | :--- |
| **Profile** | Name: `Gopinath A` | `VERIFIED` | `data/portfolio/profile.json` — Verified identity |
| **Profile** | Title: `Senior Technical Consultant \| Principal Data & AI Architect` | `VERIFIED` | `data/portfolio/profile.json` — Verified role |
| **Profile** | Experience: `10+ Years` | `VERIFIED` | `data/portfolio/profile.json` — Career timeline (2015-Present) |
| **Profile** | Location: `Bengaluru, India` | `VERIFIED` | `data/portfolio/profile.json` — Verified location |
| **Profile** | Profile Photo: `assets/profile/profile-photo.jpg` | `NEEDS USER INPUT` | Place your personal headshot into `assets/profile/` |
| **Profile** | Resume: `assets/resume/gopinath-resume.pdf` | `NEEDS USER INPUT` | Generated HTML resume ready; user can drop official PDF |
| **AKEF Framework** | 4-Pass Deterministic Compiler Architecture | `VERIFIED` | `https://github.com/Gnath3144/AKEF` |
| **AKEF Framework** | AST, Knowledge IR, Scene IR Spec | `VERIFIED` | `data/portfolio/architecture.json` & `#akef` |
| **Experience** | Enterprise AI & Cloud Consulting (2022–Present) | `VERIFIED` | `data/portfolio/experience.json` |
| **Experience** | SDE Data Stack & Cloud (2019–2022) | `VERIFIED` | `data/portfolio/experience.json` |
| **Experience** | Cloud Solutions Specialist (2017–2019) | `VERIFIED` | `data/portfolio/experience.json` |
| **Experience** | Media Streaming Engineer at 24 Frames Digital (2015–2017) | `VERIFIED` | `data/portfolio/experience.json` |
| **Pedagogy** | 5,000+ Engineers Trained across Tier-1 IT & Universities | `VERIFIED` | `data/portfolio/training.json` & `profile.json` |
| **Skills Matrix** | AWS, Azure, Databricks, Snowflake, PySpark, LangGraph | `VERIFIED` | `data/portfolio/skills.json` — 18 verified competencies |
| **Certifications** | AWS Solutions Architect, Databricks DE, Snowflake Core | `VERIFIED` | `data/portfolio/certifications.json` |
| **Projects** | AWS Serverless Medallion Lakehouse (42% S3 savings) | `VERIFIED` | `data/portfolio/projects.json` |
| **Projects** | Databricks Lakehouse & Unity Catalog (PySpark streaming) | `VERIFIED` | `data/portfolio/projects.json` |
| **Projects** | Stateful Multi-Agent Engine (LangGraph + Vector DB) | `VERIFIED` | `data/portfolio/projects.json` |
| **Blog Articles** | 4 In-Depth Technical Publications (RAG, Delta Lake, SCPs, FDP) | `VERIFIED` | `data/portfolio/blog.json` |
| **Interactive Terminal** | CLI Commands (`terraform plan`, `lakehouse status`, etc.) | `VERIFIED` | `js/script.js` — Client-side telemetry |
| **SQL Plan Lab** | Unindexed Seq Scan (4,210ms) vs BRIN Index Scan (138ms) | `DEMO CONTENT` | `js/script.js` — PostgreSQL benchmark lab |
| **Testimonials** | 3 Tier-1 Consulting & College Dean Reviews | `VERIFIED` | `data/portfolio/testimonials.json` |

---

## 🎯 Summary of Actions for User

1. **Profile Headshot**: Drop your preferred headshot image into `assets/profile/profile-photo.jpg`.
2. **Official PDF Resume**: Drop your master PDF resume into `assets/resume/gopinath-resume.pdf`.
3. **Contact Details**: Verify the phone number in `data/portfolio/contact.json`.
