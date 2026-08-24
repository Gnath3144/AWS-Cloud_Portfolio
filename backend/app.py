"""
backend/app.py - FastAPI Enterprise Application & API Endpoints
"""
import os
import json
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Request, HTTPException, Header, Depends, Query, Response, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse

from backend.config import settings
from backend.models import (
    ContactSubmissionRequest,
    ContactResponse,
    LeadEntity,
    LeadStatusUpdateRequest
)
from backend.repositories.csv_repository import CSVLeadRepository
from backend.repositories.sqlite_repository import SQLiteLeadRepository
from backend.services.lead_service import LeadService
from backend.services.github_service import GitHubService
from backend.services.ai_assistant_service import AIAssistantService
from backend.services.analytics_service import AnalyticsService
from backend.middleware.security_middleware import SecurityHeadersMiddleware, RateLimiter, sanitize_input_text

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/api/docs",
    redoc_url=None
)

# Register Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite Repository as Primary
sqlite_repo = SQLiteLeadRepository(db_path=settings.sqlite_db_path)
lead_service = LeadService(repository=sqlite_repo)
github_service = GitHubService()
ai_assistant_service = AIAssistantService()
analytics_service = AnalyticsService()
rate_limiter = RateLimiter(requests_per_window=30, window_seconds=60)

# Security Dependency for Admin APIs
def verify_admin_key(x_admin_key: Optional[str] = Header(None), key: Optional[str] = Query(None)):
    provided_key = x_admin_key or key
    if not provided_key or provided_key != settings.admin_api_key:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid Admin API Key")
    return True

# -------------------------------------------------------------
# CMS JSON DATA API (Component 15)
# -------------------------------------------------------------
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))

@app.get("/api/cms/{section}")
async def get_cms_section(section: str):
    section_clean = sanitize_input_text(section).lower()
    file_path = os.path.join(DATA_DIR, f"{section_clean}.json")
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading CMS section {section_clean}")
    raise HTTPException(status_code=404, detail=f"CMS Section {section_clean} not found")

# -------------------------------------------------------------
# GITHUB LIVE INTEGRATION API (Component 14)
# -------------------------------------------------------------
@app.get("/api/github/overview")
async def get_github_overview(refresh: bool = Query(False)):
    return github_service.get_github_data(force_refresh=refresh)

# -------------------------------------------------------------
# FLOATING AI ASSISTANT API (Component 16)
# -------------------------------------------------------------
@app.post("/api/ai-assistant/query")
async def query_ai_assistant(payload: Dict[str, Any] = Body(...), request: Request = None):
    client_ip = request.client.host if request and request.client else "unknown"
    if rate_limiter.is_rate_limited(client_ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please wait a moment.")
    
    query_text = sanitize_input_text(payload.get("query", ""))
    if not query_text:
        raise HTTPException(status_code=400, detail="Query text cannot be empty.")
    
    return ai_assistant_service.query(query_text)

# -------------------------------------------------------------
# VISITOR ANALYTICS & INTELLIGENCE API (Component 13)
# -------------------------------------------------------------
@app.post("/api/analytics/session")
async def record_analytics_session(payload: Dict[str, Any] = Body(...), request: Request = None):
    client_ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip() or (request.client.host if request and request.client else "Unknown")
    user_agent = request.headers.get("user-agent", "Unknown")
    
    session_data = {
        "session_id": payload.get("session_id"),
        "visitor_id": payload.get("visitor_id"),
        "ip_address": client_ip,
        "country": payload.get("country", "Unknown"),
        "device": payload.get("device", "Desktop"),
        "browser": payload.get("browser", "Chrome"),
        "os": payload.get("os", "Windows"),
        "referrer": payload.get("referrer", "Direct"),
        "time_spent_seconds": payload.get("time_spent_seconds", 0)
    }
    analytics_service.track_session(session_data)
    return {"status": "success"}

@app.post("/api/analytics/event")
async def record_analytics_event(payload: Dict[str, Any] = Body(...)):
    session_id = payload.get("session_id")
    event_type = payload.get("event_type")
    event_target = payload.get("event_target")
    if session_id and event_type and event_target:
        analytics_service.track_event(session_id, event_type, event_target)
    return {"status": "success"}

@app.get("/api/analytics/dashboard")
async def get_analytics_dashboard(_: bool = Depends(verify_admin_key)):
    return analytics_service.get_dashboard_summary()

# -------------------------------------------------------------
# PUBLIC CONTACT API
# -------------------------------------------------------------
@app.post("/api/contact", response_model=ContactResponse)
async def submit_contact_form(req: ContactSubmissionRequest, request: Request):
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "Unknown"

    if rate_limiter.is_rate_limited(client_ip):
        raise HTTPException(status_code=429, detail="Too many contact submissions from your IP. Please try again later.")

    user_agent = request.headers.get("user-agent", "Unknown")

    try:
        saved_lead = lead_service.process_submission(
            req=req,
            ip_address=client_ip,
            user_agent=user_agent
        )
        
        # Track analytics event for contact conversion
        session_id = request.headers.get("x-session-id", f"session_{client_ip}")
        analytics_service.track_event(session_id, "contact_submission", req.service)
        
        return ContactResponse(
            success=True,
            reference_id=saved_lead.id,
            message="Your enquiry has been received successfully. A confirmation has been logged."
        )
    except ValueError as val_err:
        raise HTTPException(status_code=429, detail=str(val_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while saving your enquiry.")

# -------------------------------------------------------------
# PROTECTED ADMIN LEADS API
# -------------------------------------------------------------
@app.get("/api/leads", response_model=List[LeadEntity])
async def list_leads(
    search: Optional[str] = Query(None),
    service: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    sort_by: str = Query("timestamp"),
    order: str = Query("desc"),
    _: bool = Depends(verify_admin_key)
):
    return lead_service.list_leads(
        search=search,
        service=service,
        status=status,
        sort_by=sort_by,
        order=order
    )

@app.get("/api/leads/{lead_id}", response_model=LeadEntity)
async def get_lead_by_id(lead_id: str, _: bool = Depends(verify_admin_key)):
    lead = lead_service.get_lead(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@app.patch("/api/leads/{lead_id}", response_model=LeadEntity)
async def update_lead_status(
    lead_id: str,
    update_req: LeadStatusUpdateRequest,
    _: bool = Depends(verify_admin_key)
):
    updated = lead_service.update_lead(lead_id, update_req)
    if not updated:
        raise HTTPException(status_code=404, detail="Lead not found")
    return updated

@app.delete("/api/leads/{lead_id}")
async def delete_lead_by_id(lead_id: str, _: bool = Depends(verify_admin_key)):
    deleted = lead_service.delete_lead(lead_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"success": True, "message": f"Lead {lead_id} deleted successfully."}

@app.get("/api/leads/export/csv")
@app.get("/api/admin/export/csv")
async def export_leads_csv(_: bool = Depends(verify_admin_key)):
    raw_csv = lead_service.export_csv()
    return Response(
        content=raw_csv,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads_export.csv"}
    )

@app.get("/api/admin/stats")
async def get_admin_stats(_: bool = Depends(verify_admin_key)):
    if hasattr(sqlite_repo, "get_stats"):
        return sqlite_repo.get_stats()
    leads = lead_service.list_leads()
    return {
        "total": len(leads),
        "new": sum(1 for l in leads if l.status == "New"),
        "contacted": sum(1 for l in leads if l.status == "Contacted"),
        "qualified": sum(1 for l in leads if l.status == "Qualified"),
        "converted": sum(1 for l in leads if l.status == "Converted"),
        "closed": sum(1 for l in leads if l.status == "Closed")
    }

@app.get("/api/admin/database/download")
async def download_sqlite_database(_: bool = Depends(verify_admin_key)):
    db_path = settings.sqlite_db_path
    if os.path.exists(db_path):
        return FileResponse(
            path=db_path,
            filename="leads.db",
            media_type="application/x-sqlite3"
        )
    raise HTTPException(status_code=404, detail="SQLite Database file not found")

@app.get("/api/admin/leads", response_model=List[LeadEntity])
async def list_admin_leads(
    search: Optional[str] = Query(None),
    service: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    sort_by: str = Query("timestamp"),
    order: str = Query("desc"),
    _: bool = Depends(verify_admin_key)
):
    return lead_service.list_leads(
        search=search,
        service=service,
        status=status,
        sort_by=sort_by,
        order=order
    )

# -------------------------------------------------------------
# PROTECTED CONTENT MANAGEMENT & ASSETS API (Phase 2.6)
# -------------------------------------------------------------
ALLOWED_CMS_SECTIONS = {
    "profile", "skills", "experience", "education", 
    "certifications", "projects", "services", "blog", 
    "testimonials", "training", "publications", "website-settings"
}

@app.get("/api/admin/content/{section}")
async def get_admin_content(section: str, _: bool = Depends(verify_admin_key)):
    section_clean = sanitize_input_text(section).lower()
    if section_clean not in ALLOWED_CMS_SECTIONS:
        raise HTTPException(status_code=400, detail=f"Invalid CMS section: {section_clean}")
    
    file_path = os.path.join(DATA_DIR, f"{section_clean}.json")
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to read {section_clean}.json")
    raise HTTPException(status_code=404, detail=f"Section {section_clean}.json not found")

@app.put("/api/admin/content/{section}")
async def update_admin_content(
    section: str, 
    payload: Any = Body(...), 
    _: bool = Depends(verify_admin_key)
):
    section_clean = sanitize_input_text(section).lower()
    if section_clean not in ALLOWED_CMS_SECTIONS:
        raise HTTPException(status_code=400, detail=f"Invalid CMS section: {section_clean}")
    
    file_path = os.path.join(DATA_DIR, f"{section_clean}.json")
    backup_path = os.path.join(DATA_DIR, f"{section_clean}.json.bak")
    
    try:
        # Create automated safety backup of existing file
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as src, open(backup_path, "w", encoding="utf-8") as dst:
                dst.write(src.read())
        
        # Atomic write updated content
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)
            
        return {
            "status": "success",
            "message": f"Successfully updated and persisted data/{section_clean}.json",
            "section": section_clean
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write {section_clean}.json: {str(e)}")

@app.post("/api/admin/assets/upload")
async def upload_asset_file(
    request: Request,
    _: bool = Depends(verify_admin_key)
):
    form = await request.form()
    file_obj = form.get("file")
    target_folder = form.get("folder", "downloads")  # "images" or "downloads"
    
    if not file_obj or not hasattr(file_obj, "filename"):
        raise HTTPException(status_code=400, detail="No valid file uploaded.")
    
    filename = os.path.basename(file_obj.filename)
    if target_folder not in ["images", "downloads"]:
        target_folder = "downloads"
        
    destination_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", target_folder))
    os.makedirs(destination_dir, exist_ok=True)
    destination_path = os.path.join(destination_dir, filename)
    
    try:
        contents = await file_obj.read()
        with open(destination_path, "wb") as f:
            f.write(contents)
        return {
            "status": "success",
            "filename": filename,
            "path": f"{target_folder}/{filename}",
            "size_bytes": len(contents)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save asset: {str(e)}")

# -------------------------------------------------------------
# STATIC FILES & ROUTING
# -------------------------------------------------------------
WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

@app.get("/admin", response_class=HTMLResponse)
async def serve_admin_dashboard():
    admin_html_path = os.path.join(WORKSPACE_DIR, "admin", "index.html")
    if os.path.exists(admin_html_path):
        with open(admin_html_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse("<h2>Admin Dashboard Not Found</h2>", status_code=404)

# Mount static directories
css_path = os.path.join(WORKSPACE_DIR, "css")
if os.path.exists(css_path):
    app.mount("/css", StaticFiles(directory=css_path), name="css")

js_path = os.path.join(WORKSPACE_DIR, "js")
if os.path.exists(js_path):
    app.mount("/js", StaticFiles(directory=js_path), name="js")

data_path = os.path.join(WORKSPACE_DIR, "data")
if os.path.exists(data_path):
    app.mount("/data-static", StaticFiles(directory=data_path), name="data-static")

admin_path = os.path.join(WORKSPACE_DIR, "admin")
if os.path.exists(admin_path):
    app.mount("/admin-static", StaticFiles(directory=admin_path), name="admin-static")

@app.get("/", response_class=HTMLResponse)
async def serve_index():
    index_path = os.path.join(WORKSPACE_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse("<h2>Portfolio Homepage Not Found</h2>", status_code=404)
