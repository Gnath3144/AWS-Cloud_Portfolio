# Portfolio Content Database & VS Code Maintenance Guide

Welcome to your centralized, zero-server portfolio content management system. 

All professional information, projects, certifications, blog posts, and asset references are stored directly as **clean JSON files** in `data/portfolio/`. You can edit everything directly in **VS Code**, save, and push to GitHub.

---

## 🏛️ Architecture

```
YOU (in VS Code)
      │
      ▼ (Edit JSON & drop assets)
data/portfolio/*.json  +  assets/*
      │
      ▼ (Git Commit & Push)
GitHub Repository (main branch)
      │
      ▼ (Automated GitHub Actions CI/CD)
GitHub Pages Live Portfolio (100% Free Hosting)
```

**Key Principle**: **NO DATA = NO INVENTION**. If a field is empty (`""` or `[]` or `null`) or marked `"published": false`, the public website will cleanly hide the optional component or render a neutral fallback.

---

## 🗂️ Content Database Directory Structure

```
AWS-Cloud_Portfolio/
│
├── data/
│   └── portfolio/
│       ├── profile.json         ← Identity, title, summary, location, experience years
│       ├── about.json           ← Career story, biography paragraphs, core pillars
│       ├── contact.json         ← Email, phone, advisory types, response time
│       ├── social.json          ← GitHub, LinkedIn, email links
│       ├── skills.json          ← Categorized technical skills matrix
│       ├── experience.json      ← Professional career timeline & achievements
│       ├── education.json       ← Academic degrees, institution & focus areas
│       ├── projects.json        ← Flagship projects & case studies
│       ├── certifications.json  ← AWS, Databricks, Snowflake credentials
│       ├── services.json        ← Advisory offerings, FDPs, lakehouse consulting
│       ├── testimonials.json    ← Client reviews & feedback
│       ├── training.json        ← Corporate bootcamps & workshop syllabi
│       ├── blog.json            ← Technical articles, research papers & writeups
│       ├── architecture.json    ← 15-tab blueprints, Terraform IaC, FinOps data
│       ├── downloads.json       ← Whitepapers & downloadable dossier catalog
│       ├── assets.json          ← Central media asset registry
│       └── settings.json        ← Global site metadata & active resume pointer
│
└── assets/
    ├── profile/                 ← Your profile photos and headshots
    ├── projects/                ← Project screenshots and architecture diagrams
    ├── certificates/            ← Accreditation badges and certificate PDFs
    ├── architecture/            ← System flowcharts and SVG schematics
    ├── resume/                  ← Resume PDF versions and dossiers
    ├── documents/               ← Whitepapers and FDP brochures
    └── social/                  ← OpenGraph share cards and social previews
```

---

## 🛠️ Step-by-Step Content Workflows

### 1. How to Update Your Profile Information
Open [`data/portfolio/profile.json`](file:///c:/Users/gnath/SJBIT_DSA/AWS-Cloud_Portfolio/data/portfolio/profile.json) in VS Code:
```json
{
  "fullName": "Gopinath A",
  "professionalTitle": "Senior Technical Consultant | Principal Data & AI Architect",
  "shortHeadline": "10+ Years Building High-Throughput Cloud Lakehouses",
  "location": "Bengaluru, India",
  "yearsOfExperience": 10,
  "summary": "Your executive summary...",
  "published": true
}
```

### 2. How to Add or Change Your Profile Photo
1. Save your portrait image (e.g. `my-photo.jpg`) inside `assets/profile/`.
2. Register the asset in [`data/portfolio/assets.json`](file:///c:/Users/gnath/SJBIT_DSA/AWS-Cloud_Portfolio/data/portfolio/assets.json):
   ```json
   {
     "id": "asset-profile-photo",
     "type": "image",
     "path": "assets/profile/my-photo.jpg",
     "alt": "Gopinath A Portrait",
     "published": true
   }
   ```
3. In [`data/portfolio/profile.json`](file:///c:/Users/gnath/SJBIT_DSA/AWS-Cloud_Portfolio/data/portfolio/profile.json), update `"profilePhoto": "assets/profile/my-photo.jpg"`.

### 3. How to Upload a New Resume
1. Copy your new PDF (e.g. `Gopinath_Resume_2026.pdf`) into `assets/resume/`.
2. Update the resume path in [`data/portfolio/profile.json`](file:///c:/Users/gnath/SJBIT_DSA/AWS-Cloud_Portfolio/data/portfolio/profile.json):
   ```json
   "resume": "assets/resume/Gopinath_Resume_2026.pdf"
   ```
3. Update [`data/portfolio/settings.json`](file:///c:/Users/gnath/SJBIT_DSA/AWS-Cloud_Portfolio/data/portfolio/settings.json) `"activeResumePath"` if needed.

### 4. How to Add a New Project
Open [`data/portfolio/projects.json`](file:///c:/Users/gnath/SJBIT_DSA/AWS-Cloud_Portfolio/data/portfolio/projects.json) and add an entry:
```json
{
  "id": "project-005",
  "title": "Real-Time FinOps Anomaly Detector",
  "slug": "finops-detector",
  "summary": "Serverless AWS Lambda pipeline detecting anomalous S3 egress costs.",
  "description": "Full technical overview...",
  "technologies": ["AWS Lambda", "CloudWatch", "Python", "Terraform"],
  "githubUrl": "https://github.com/Gnath3144/finops-detector",
  "liveUrl": "",
  "image": "assets/projects/finops-preview.png",
  "featured": true,
  "published": true
}
```

### 5. How to Add Experience
Open [`data/portfolio/experience.json`](file:///c:/Users/gnath/SJBIT_DSA/AWS-Cloud_Portfolio/data/portfolio/experience.json):
```json
{
  "id": "exp-005",
  "role": "Principal Cloud Architect",
  "organization": "Enterprise Cloud Consultancy",
  "location": "Bengaluru, India",
  "period": "2026 - Present",
  "summary": "Directing cloud modernization and AI compiler implementations.",
  "highlights": [
    "Delivered 120M+ event daily lakehouse architecture.",
    "Mentored 5,000+ software engineers across tier-1 IT firms."
  ],
  "technologies": ["AWS", "Databricks", "AKEF", "PySpark"],
  "published": true
}
```

### 6. How to Publish or Hide Content
Every entity in the database supports a `"published"` boolean:
- Set `"published": true` &rarr; Item is rendered on the public website.
- Set `"published": false` &rarr; Item is completely hidden from the public website.

---

## 🚀 How to Deploy Your Changes to the Live Website

Whenever you make any changes in VS Code:

```bash
# 1. Check your modified JSON files
git status

# 2. Stage and commit
git add .
git commit -m "Update profile experience and new project"

# 3. Push to GitHub
git push origin main
```

Within ~60 seconds, GitHub Actions will automatically deploy the updated site to:
**https://gnath3144.github.io/AWS-Cloud_Portfolio/**
