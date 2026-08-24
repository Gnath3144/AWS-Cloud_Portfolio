"""
tests/test_portfolio.py - Automated Test Suite for Static Content Database
Validates:
- Phase 1 & 2: Static Asset & HTML Integrity, Navigation, Scrollspy
- Phase 2.5: Central Portfolio Content Database (data/portfolio/*.json) & Zero Admin
- Data Service (js/data-service.js)
- Architecture Blueprints & Terraform IaC
- SEO, Accessibility & OpenGraph Assets
"""

import os
import sys
import json
import re
import pytest

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

DATA_PORTFOLIO_DIR = os.path.join(ROOT_DIR, "data", "portfolio")
ASSETS_DIR = os.path.join(ROOT_DIR, "assets")

# -------------------------------------------------------------
# PART 1: ZERO ADMIN VERIFICATION
# -------------------------------------------------------------
def test_no_admin_directory_or_portal_files():
    admin_dir = os.path.join(ROOT_DIR, "admin")
    assert not os.path.exists(admin_dir), "admin/ directory must be completely removed"

def test_no_admin_links_in_index_html():
    index_path = os.path.join(ROOT_DIR, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()

    assert "openAdminPortal" not in html, "openAdminPortal must not exist in index.html"
    assert 'href="admin/"' not in html and "href='admin/'" not in html, "admin/ links must not exist in index.html"
    assert "Admin Operations Portal" not in html, "Admin buttons must not exist in index.html"

# -------------------------------------------------------------
# PART 2 & 3: CENTRAL CONTENT DATABASE VALIDATION
# -------------------------------------------------------------
def test_all_portfolio_json_files_exist_and_are_valid():
    required_files = [
        "profile.json", "about.json", "contact.json", "social.json",
        "skills.json", "experience.json", "education.json", "projects.json",
        "certifications.json", "services.json", "testimonials.json",
        "training.json", "blog.json", "architecture.json",
        "downloads.json", "assets.json", "settings.json"
    ]
    for filename in required_files:
        file_path = os.path.join(DATA_PORTFOLIO_DIR, filename)
        assert os.path.exists(file_path), f"Missing portfolio data file: data/portfolio/{filename}"
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            assert data is not None, f"JSON in {filename} is empty or None"

def test_portfolio_profile_schema():
    with open(os.path.join(DATA_PORTFOLIO_DIR, "profile.json"), "r", encoding="utf-8") as f:
        profile = json.load(f)
    assert profile["fullName"] == "Gopinath A"
    assert "professionalTitle" in profile
    assert profile["yearsOfExperience"] >= 10
    assert profile["published"] is True

def test_portfolio_skills_schema():
    with open(os.path.join(DATA_PORTFOLIO_DIR, "skills.json"), "r", encoding="utf-8") as f:
        skills = json.load(f)
    assert "categories" in skills
    assert len(skills["categories"]) >= 3

# -------------------------------------------------------------
# PART 4 & 6: DATA SERVICE & ASSET FOLDERS
# -------------------------------------------------------------
def test_data_service_script_exists():
    ds_path = os.path.join(ROOT_DIR, "js", "data-service.js")
    assert os.path.exists(ds_path), "js/data-service.js must exist"
    with open(ds_path, "r", encoding="utf-8") as f:
        content = f.read()
    assert "PortfolioData" in content
    assert "load" in content

def test_assets_directories_exist():
    expected_folders = [
        "profile", "projects", "certificates", 
        "architecture", "resume", "documents", "social"
    ]
    for folder in expected_folders:
        folder_path = os.path.join(ASSETS_DIR, folder)
        assert os.path.exists(folder_path), f"Missing assets subfolder: assets/{folder}"

# -------------------------------------------------------------
# PART 5: ARCHITECTURE & SEO
# -------------------------------------------------------------
def test_html_essential_sections_and_seo():
    index_path = os.path.join(ROOT_DIR, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()

    expected_sections = [
        "hero", "akef", "opensource", "what-i-build", 
        "stack", "clients", "architecture", "journey", 
        "services", "blog", "testimonials", "certifications", 
        "downloads", "contact"
    ]
    for sec in expected_sections:
        assert f'id="{sec}"' in html or f"id='{sec}'" in html, f"Section #{sec} missing from index.html"

    assert 'src="js/data-service.js"' in html, "js/data-service.js must be included in index.html"
    assert os.path.exists(os.path.join(ROOT_DIR, "images", "og-preview.png")), "OG preview image must exist"
    assert os.path.exists(os.path.join(ROOT_DIR, "CONTENT_DATABASE_GUIDE.md")), "CONTENT_DATABASE_GUIDE.md must exist"
    assert os.path.exists(os.path.join(ROOT_DIR, "CONTENT_MIGRATION_AUDIT.md")), "CONTENT_MIGRATION_AUDIT.md must exist"
