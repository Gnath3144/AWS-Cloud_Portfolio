# Gopinath A | Enterprise AI Architect & Principal Data Engineer Portfolio

A modern, high-performance portfolio showcasing enterprise solutions across AWS Cloud, Databricks Delta Lake, Snowflake, LangGraph, and the **AKEF** (AI Knowledge Engineering Framework).

---

## 🚀 Free Hosting on GitHub Pages

This portfolio is fully optimized to run 100% free on **GitHub Pages** with zero server costs, automated CI/CD deployments, and client-side fallback engines.

### Instant 1-Minute Setup

1. **Commit and Push to GitHub**:
   ```bash
   git add .
   git commit -m "Configure GitHub Pages free hosting"
   git remote add origin https://github.com/Gnath3144/AWS-Cloud_Portfolio.git
   git branch -M main
   git push -u origin main
   ```

2. **Enable GitHub Pages in Repository Settings**:
   - Go to your repository on GitHub: `https://github.com/Gnath3144/AWS-Cloud_Portfolio`
   - Click **Settings** (top navigation tab) &rarr; Select **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Source**:
     - **Option A (Automated via Actions - Recommended)**: Select **GitHub Actions**. The included workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) will build and deploy automatically on every push!
     - **Option B (Direct Branch)**: Select **Deploy from a branch** &rarr; Branch: `main` &rarr; Folder: `/ (root)` &rarr; Click **Save**.

3. **Visit Your Live Free Website**:
   Your site will be live at:
   ```
   https://gnath3144.github.io/AWS-Cloud_Portfolio/
   ```

---

## ✨ Features Included

- **Autonomous Interactive AI Assistant**: Works offline & in-browser with built-in intent classification.
- **Dynamic GitHub Metrics Sync**: Connects directly to the GitHub Public REST API with seamless offline fallback.
- **Interactive Architecture Explorer**: Visual interactive explorer for AWS, Databricks, Snowflake & AKEF pipelines.
- **Dynamic CMS Loader**: Loads case studies, testimonials, certifications, and project dossiers from structured JSON data.
- **Resilient Contact Logging**: Logs inquiries securely to localStorage when running in static mode, with full export options.
- **Admin Intelligence Dashboard**: Located at `admin/` to inspect inquiries, filter leads, and export CSV reports.

---

## 🛠 Local Development

To run locally using standard Python HTTP server or FastAPI:

```bash
# Pure static local server
python -m http.server 8000

# Or FastAPI full-stack server
python run_server.py
```
