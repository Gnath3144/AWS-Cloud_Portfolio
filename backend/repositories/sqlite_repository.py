"""
backend/repositories/sqlite_repository.py - SQLite Lead Repository Implementation
Production-ready SQLite persistence for leads and inquiries.
"""
import os
import sqlite3
from typing import List, Optional, Dict, Any
from datetime import datetime

from backend.models import LeadEntity
from backend.repositories.base import BaseLeadRepository


class SQLiteLeadRepository(BaseLeadRepository):
    """
    SQLite-backed Lead Repository implementing resilient database storage,
    full-text search, status lifecycle management, and KPI telemetry.
    """

    def __init__(self, db_path: str = "database/leads.db"):
        self.db_path = db_path
        os.makedirs(os.path.dirname(os.path.abspath(self.db_path)), exist_ok=True)
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self) -> None:
        """Initialize leads table schema if not exists."""
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS leads (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    phone TEXT,
                    company TEXT,
                    service TEXT NOT NULL,
                    contact_method TEXT NOT NULL,
                    subject TEXT NOT NULL,
                    message TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'unread',
                    admin_notes TEXT,
                    client_ip TEXT,
                    user_agent TEXT,
                    browser TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            """)
            conn.execute("CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at)")
            conn.commit()

    def _row_to_entity(self, row: sqlite3.Row) -> LeadEntity:
        return LeadEntity(
            id=row["id"],
            name=row["name"],
            email=row["email"],
            phone=row["phone"] or "",
            company=row["company"] or "",
            service=row["service"],
            contact_method=row["contact_method"],
            subject=row["subject"],
            message=row["message"],
            status=row["status"] if row["status"] in ("New", "Contacted", "Closed") else "New",
            notes=row["admin_notes"] or "",
            ip_address=row["client_ip"] or "Unknown",
            browser=row["browser"] or row["user_agent"] or "Unknown",
            timestamp=row["created_at"]
        )

    def create(self, lead: LeadEntity) -> LeadEntity:
        """Persist a new lead entity to SQLite."""
        now_str = datetime.utcnow().isoformat()
        with self._get_connection() as conn:
            conn.execute("""
                INSERT INTO leads (
                    id, name, email, phone, company, service, contact_method,
                    subject, message, status, admin_notes, client_ip, user_agent,
                    browser, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                lead.id,
                lead.name,
                lead.email,
                lead.phone or "",
                lead.company or "",
                lead.service,
                lead.contact_method,
                lead.subject,
                lead.message,
                lead.status or 'New',
                getattr(lead, 'notes', None) or getattr(lead, 'admin_notes', None) or '',
                getattr(lead, 'ip_address', None) or getattr(lead, 'client_ip', None) or "Unknown",
                getattr(lead, 'browser', None) or getattr(lead, 'user_agent', None) or "Unknown",
                getattr(lead, 'browser', None) or '',
                lead.timestamp or now_str,
                now_str
            ))
            conn.commit()
        return lead

    def get_by_id(self, lead_id: str) -> Optional[LeadEntity]:
        """Retrieve single lead by reference ID."""
        with self._get_connection() as conn:
            row = conn.execute("SELECT * FROM leads WHERE id = ?", (lead_id,)).fetchone()
            if row:
                return self._row_to_entity(row)
        return None

    def list_all(
        self,
        search: Optional[str] = None,
        service: Optional[str] = None,
        status: Optional[str] = None,
        sort_by: str = "timestamp",
        order: str = "desc"
    ) -> List[LeadEntity]:
        """List all leads with optional status filter and search query."""
        query = "SELECT * FROM leads WHERE 1=1"
        params = []

        if status and status.lower() != 'all':
            query += " AND LOWER(status) = ?"
            params.append(status.lower())

        if service and service.lower() != 'all':
            query += " AND LOWER(service) = ?"
            params.append(service.lower())

        if search:
            search_like = f"%{search.lower()}%"
            query += """ AND (
                LOWER(name) LIKE ? OR
                LOWER(email) LIKE ? OR
                LOWER(company) LIKE ? OR
                LOWER(subject) LIKE ? OR
                LOWER(service) LIKE ? OR
                LOWER(id) LIKE ?
            )"""
            params.extend([search_like] * 6)

        sort_col = "created_at"
        sort_dir = "DESC" if order.lower() == "desc" else "ASC"
        query += f" ORDER BY {sort_col} {sort_dir}"

        with self._get_connection() as conn:
            rows = conn.execute(query, params).fetchall()
            return [self._row_to_entity(r) for r in rows]

    def update(self, lead_id: str, status: Optional[str] = None, notes: Optional[str] = None) -> Optional[LeadEntity]:
        """Update lead status lifecycle and admin notes."""
        lead = self.get_by_id(lead_id)
        if not lead:
            return None

        new_status = status or lead.status
        new_notes = notes if notes is not None else (lead.notes or '')
        now_str = datetime.utcnow().isoformat()

        with self._get_connection() as conn:
            conn.execute("""
                UPDATE leads
                SET status = ?, admin_notes = ?, updated_at = ?
                WHERE id = ?
            """, (new_status, new_notes, now_str, lead_id))
            conn.commit()

        return self.get_by_id(lead_id)

    def delete(self, lead_id: str) -> bool:
        """Delete lead from SQLite database."""
        with self._get_connection() as conn:
            cursor = conn.execute("DELETE FROM leads WHERE id = ?", (lead_id,))
            conn.commit()
            return cursor.rowcount > 0

    def get_stats(self) -> Dict[str, Any]:
        """Calculate real-time operational metrics for admin dashboard."""
        today_prefix = datetime.utcnow().strftime("%Y-%m-%d")
        month_prefix = datetime.utcnow().strftime("%Y-%m")

        with self._get_connection() as conn:
            total = conn.execute("SELECT COUNT(*) FROM leads").fetchone()[0]
            today = conn.execute("SELECT COUNT(*) FROM leads WHERE created_at LIKE ?", (f"{today_prefix}%",)).fetchone()[0]
            this_month = conn.execute("SELECT COUNT(*) FROM leads WHERE created_at LIKE ?", (f"{month_prefix}%",)).fetchone()[0]
            new_leads = conn.execute("SELECT COUNT(*) FROM leads WHERE LOWER(status) IN ('new', 'unread')").fetchone()[0]
            contacted = conn.execute("SELECT COUNT(*) FROM leads WHERE LOWER(status) = 'contacted'").fetchone()[0]
            converted = conn.execute("SELECT COUNT(*) FROM leads WHERE LOWER(status) = 'converted'").fetchone()[0]
            closed = conn.execute("SELECT COUNT(*) FROM leads WHERE LOWER(status) = 'closed'").fetchone()[0]

            services_rows = conn.execute("SELECT service, COUNT(*) as cnt FROM leads GROUP BY service").fetchall()
            service_breakdown = {r["service"]: r["cnt"] for r in services_rows}

        return {
            "total": total,
            "today": today,
            "this_month": this_month,
            "new": new_leads,
            "contacted": contacted,
            "converted": converted,
            "closed": closed,
            "service_breakdown": service_breakdown
        }

    def get_kpis(self) -> Dict[str, Any]:
        return self.get_stats()

    def export_csv_raw(self) -> str:
        """Generate formatted CSV string of all leads."""
        leads = self.list_all()
        header = "ID,Timestamp,Name,Email,Phone,Company,Service,ContactMethod,Subject,Message,Status,AdminNotes\n"
        lines = [header]
        for l in leads:
            row = [
                f'"{l.id}"',
                f'"{l.timestamp}"',
                f'"{l.name.replace(chr(34), chr(39))}"',
                f'"{l.email}"',
                f'"{l.phone or ""}"',
                f'"{l.company or ""}"',
                f'"{l.service}"',
                f'"{l.contact_method}"',
                f'"{l.subject.replace(chr(34), chr(39))}"',
                f'"{l.message.replace(chr(34), chr(39)).replace(chr(10), " ")}"',
                f'"{l.status or "New"}"',
                f'"{getattr(l, "notes", "") or getattr(l, "admin_notes", "")}"'
            ]
            lines.append(",".join(row) + "\n")
        return "".join(lines)
