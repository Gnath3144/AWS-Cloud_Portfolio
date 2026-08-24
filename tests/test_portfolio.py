"""
tests/test_portfolio.py - Automated End-to-End Suite for Portfolio & CMS
Tests all phases:
- Phase 1 & 2: HTML/JS/CSS assets & anchor targets
- Phase 2.5: Real Data Foundation (valid schemas for all data/*.json files)
- Phase 2.6: FastAPI CMS API routes & security headers
- Phase 3 & 4: Architecture blueprints, SEO metadata, and sitemap validation
"""

import os
import sys
import json
import re

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import pytest
from fastapi.testclient import TestClient

from backend.app import app
from backend.config import settings

client = TestClient(app)
DATA_DIR = os.path.join(ROOT_DIR, "data")

# -------------------------------------------------------------
# PHASE 1 & 2: STATIC ASSET & HTML INTEGRITY TESTS
# -------------------------------------------------------------
def test_html_file_exists_and_has_required_sections():
    index_path = os.path.join(ROOT_DIR, "index.html")
    assert os.path.exists(index_path), "index.html must exist in project root"
    
    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Verify essential section IDs
    expected_sections = [
        "hero", "akef", "opensource", "what-i-build", 
        "stack", "clients", "architecture", "journey", 
        "services", "blog", "testimonials", "certifications", 
        "downloads", "contact", "telemetry"
    ]
    for sec in expected_sections:
        assert f'id="{sec}"' in html or f"id='{sec}'" in html, f"Section #{sec} missing from index.html"

def test_opengraph_image_exists():
    og_path = os.path.join(ROOT_DIR, "images", "og-preview.png")
    assert os.path.exists(og_path), "OpenGraph preview image must exist at images/og-preview.png"
    assert os.path.getsize(og_path) > 10000, "OpenGraph image should be a valid non-empty image file"

def test_sitemap_and_robots():
    robots_path = os.path.join(ROOT_DIR, "robots.txt")
    sitemap_path = os.path.join(ROOT_DIR, "sitemap.xml")
    assert os.path.exists(robots_path), "robots.txt must exist"
    assert os.path.exists(sitemap_path), "sitemap.xml must exist"
    
    with open(sitemap_path, "r", encoding="utf-8") as f:
        content = f.read()
    assert "https://gnath3144.github.io/AWS-Cloud_Portfolio/" in content

# -------------------------------------------------------------
# PHASE 2.5: REAL DATA FOUNDATION SCHEMA VALIDATION
# -------------------------------------------------------------
def test_all_json_data_files_valid():
    required_json_files = [
        "profile.json", "skills.json", "experience.json", 
        "education.json", "certifications.json", "projects.json", 
        "services.json", "blog.json", "testimonials.json", 
        "website-settings.json", "architecture_details.json"
    ]
    for filename in required_json_files:
        file_path = os.path.join(DATA_DIR, filename)
        assert os.path.exists(file_path), f"Missing data file: {filename}"
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            assert data is not None, f"JSON data in {filename} is empty or None"

def test_profile_data_structure():
    with open(os.path.join(DATA_DIR, "profile.json"), "r", encoding="utf-8") as f:
        profile = json.load(f)
    assert profile["name"] == "Gopinath A"
    assert "email" in profile
    assert "github" in profile
    assert "stats" in profile
    assert profile["stats"]["yearsExperience"] >= 10

def test_skills_categories():
    with open(os.path.join(DATA_DIR, "skills.json"), "r", encoding="utf-8") as f:
        skills = json.load(f)
    assert "categories" in skills
    assert len(skills["categories"]) >= 3

# -------------------------------------------------------------
# PHASE 2.6: FASTAPI CMS & ADMIN API ENDPOINTS
# -------------------------------------------------------------
def test_cms_public_endpoints():
    response = client.get("/api/cms/profile")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Gopinath A"

def test_admin_content_get_unauthorized():
    response = client.get("/api/admin/content/profile")
    assert response.status_code == 401

def test_admin_content_get_authorized():
    response = client.get(
        "/api/admin/content/profile",
        headers={"X-Admin-Key": settings.admin_api_key}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Gopinath A"

def test_admin_content_update_and_backup():
    # Read current profile
    with open(os.path.join(DATA_DIR, "profile.json"), "r", encoding="utf-8") as f:
        current_data = json.load(f)
    
    # Update through protected API
    response = client.put(
        "/api/admin/content/profile",
        headers={"X-Admin-Key": settings.admin_api_key},
        json=current_data
    )
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    
    # Verify automated backup was created
    backup_file = os.path.join(DATA_DIR, "profile.json.bak")
    assert os.path.exists(backup_file), "Automated .bak backup file must be created on update"

# -------------------------------------------------------------
# PHASE 3: CLOUD ARCHITECTURE & TERRAFORM BLUEPRINTS
# -------------------------------------------------------------
def test_architecture_details_terraform_enrichment():
    with open(os.path.join(DATA_DIR, "architecture_details.json"), "r", encoding="utf-8") as f:
        arch = json.load(f)
    
    assert "aws-lakehouse" in arch
    assert "Terraform (IaC)" in arch["aws-lakehouse"]["codeExplorer"]
    assert "aws_s3_bucket" in arch["aws-lakehouse"]["codeExplorer"]["Terraform (IaC)"]
    assert "finopsSavings" in arch["aws-lakehouse"]["performanceDashboard"]

# -------------------------------------------------------------
# PHASE 4: ACCESSIBILITY & PERFORMANCE
# -------------------------------------------------------------
def test_html_accessibility_elements():
    with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8") as f:
        html = f.read()

    # Skip to main content link
    assert 'Skip to main content' in html or 'skip-link' in html
    # Preconnect
    assert 'rel="preconnect" href="https://fonts.googleapis.com"' in html
    assert 'rel="preconnect" href="https://fonts.gstatic.com"' in html
    # Schema.org JSON-LD graph
    assert '"@type": "Person"' in html
    assert '"@type": "WebSite"' in html
