"""
run_server.py - Startup script for Gopinath Portfolio & Lead Management System
Runs FastAPI with Uvicorn on http://127.0.0.1:8000
"""
import sys
import os
import uvicorn

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

if __name__ == "__main__":
    print("=" * 65)
    print("[*] GOPINATH PORTFOLIO & LEAD ENGINE (FastAPI v2.0)")
    print("=" * 65)
    print("-> Portfolio Website: http://127.0.0.1:8000")
    print("-> Admin Dashboard:   http://127.0.0.1:8000/admin")
    print("-> API Documentation: http://127.0.0.1:8000/api/docs")
    print("=" * 65)
    
    uvicorn.run("backend.app:app", host="127.0.0.1", port=8000, reload=True)

