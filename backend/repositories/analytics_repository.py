"""
backend/repositories/analytics_repository.py - Visitor Analytics SQLite Database Repository
"""
import os
import sqlite3
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

logger = logging.getLogger("analytics_repository")

class AnalyticsRepository:
    def __init__(self, db_path: Optional[str] = None):
        if db_path is None:
            db_path = os.path.join(os.path.dirname(__file__), "..", "..", "database", "portfolio.db")
        self.db_path = os.path.abspath(db_path)
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        """Initializes analytics schema tables if they do not exist."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            # 1. Sessions table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS visitor_sessions (
                    session_id TEXT PRIMARY KEY,
                    visitor_id TEXT NOT NULL,
                    ip_address TEXT,
                    country TEXT DEFAULT 'Unknown',
                    device TEXT DEFAULT 'Desktop',
                    browser TEXT DEFAULT 'Chrome',
                    os TEXT DEFAULT 'Windows',
                    referrer TEXT DEFAULT 'Direct',
                    time_spent_seconds INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # 2. Events table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS analytics_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    event_target TEXT NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (session_id) REFERENCES visitor_sessions(session_id)
                )
            """)

            cursor.execute("CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_sessions_created ON visitor_sessions(created_at)")
            conn.commit()

    def record_session(self, session_data: Dict[str, Any]):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO visitor_sessions (session_id, visitor_id, ip_address, country, device, browser, os, referrer, time_spent_seconds)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(session_id) DO UPDATE SET
                    time_spent_seconds = time_spent_seconds + excluded.time_spent_seconds,
                    updated_at = CURRENT_TIMESTAMP
            """, (
                session_data.get("session_id"),
                session_data.get("visitor_id"),
                session_data.get("ip_address", "Unknown"),
                session_data.get("country", "Unknown"),
                session_data.get("device", "Desktop"),
                session_data.get("browser", "Unknown"),
                session_data.get("os", "Unknown"),
                session_data.get("referrer", "Direct"),
                session_data.get("time_spent_seconds", 0)
            ))
            conn.commit()

    def record_event(self, session_id: str, event_type: str, event_target: str):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO analytics_events (session_id, event_type, event_target)
                VALUES (?, ?, ?)
            """, (session_id, event_type, event_target))
            conn.commit()

    def get_analytics_summary(self) -> Dict[str, Any]:
        """Aggregates all visitor metrics for the admin analytics dashboard."""
        with self._get_connection() as conn:
            cursor = conn.cursor()

            # Total sessions & unique visitors
            cursor.execute("SELECT COUNT(session_id) as total, COUNT(DISTINCT visitor_id) as unique_v, SUM(time_spent_seconds) as total_time FROM visitor_sessions")
            row = cursor.fetchone()
            total_sessions = row["total"] or 0
            unique_visitors = row["unique_v"] or 0
            avg_time_spent = (row["total_time"] or 0) // (total_sessions or 1)

            # Daily, Weekly, Monthly visitors
            cursor.execute("SELECT COUNT(session_id) as cnt FROM visitor_sessions WHERE created_at >= date('now', '-1 day')")
            daily_v = cursor.fetchone()["cnt"] or 0

            cursor.execute("SELECT COUNT(session_id) as cnt FROM visitor_sessions WHERE created_at >= date('now', '-7 days')")
            weekly_v = cursor.fetchone()["cnt"] or 0

            cursor.execute("SELECT COUNT(session_id) as cnt FROM visitor_sessions WHERE created_at >= date('now', '-30 days')")
            monthly_v = cursor.fetchone()["cnt"] or 0

            # Breakdown by Device
            cursor.execute("SELECT device, COUNT(*) as count FROM visitor_sessions GROUP BY device ORDER BY count DESC")
            devices = {r["device"]: r["count"] for r in cursor.fetchall()}

            # Breakdown by Browser
            cursor.execute("SELECT browser, COUNT(*) as count FROM visitor_sessions GROUP BY browser ORDER BY count DESC LIMIT 5")
            browsers = {r["browser"]: r["count"] for r in cursor.fetchall()}

            # Breakdown by OS
            cursor.execute("SELECT os, COUNT(*) as count FROM visitor_sessions GROUP BY os ORDER BY count DESC LIMIT 5")
            operating_systems = {r["os"]: r["count"] for r in cursor.fetchall()}

            # Breakdown by Referrer
            cursor.execute("SELECT referrer, COUNT(*) as count FROM visitor_sessions GROUP BY referrer ORDER BY count DESC LIMIT 5")
            referrers = {r["referrer"]: r["count"] for r in cursor.fetchall()}

            # Breakdown by Country
            cursor.execute("SELECT country, COUNT(*) as count FROM visitor_sessions GROUP BY country ORDER BY count DESC LIMIT 5")
            countries = {r["country"]: r["count"] for r in cursor.fetchall()}

            # Event popularities: sections, tech, projects, downloads, repos
            def get_top_events(event_type: str, limit: int = 5) -> List[Dict[str, Any]]:
                cursor.execute("""
                    SELECT event_target, COUNT(*) as count
                    FROM analytics_events
                    WHERE event_type = ?
                    GROUP BY event_target
                    ORDER BY count DESC
                    LIMIT ?
                """, (event_type, limit))
                return [{"target": r["event_target"], "count": r["count"]} for r in cursor.fetchall()]

            most_visited_sections = get_top_events("section_view")
            most_clicked_tech = get_top_events("tech_click")
            most_viewed_projects = get_top_events("project_view")
            most_downloaded_resumes = get_top_events("download")
            most_clicked_companies = get_top_events("company_click")
            most_viewed_repos = get_top_events("repo_view")

            # Contact conversions
            cursor.execute("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'contact_submission'")
            contact_submissions = cursor.fetchone()["count"] or 0
            conversion_rate = round((contact_submissions / (total_sessions or 1)) * 100, 2)

            return {
                "total_visitors": total_sessions,
                "unique_visitors": unique_visitors,
                "daily_visitors": daily_v,
                "weekly_visitors": weekly_v,
                "monthly_visitors": monthly_v,
                "avg_time_spent_seconds": avg_time_spent,
                "devices": devices,
                "browsers": browsers,
                "operating_systems": operating_systems,
                "referrers": referrers,
                "countries": countries,
                "most_visited_sections": most_visited_sections,
                "most_clicked_technologies": most_clicked_tech,
                "most_viewed_projects": most_viewed_projects,
                "most_downloaded_resumes": most_downloaded_resumes,
                "most_clicked_companies": most_clicked_companies,
                "most_viewed_repos": most_viewed_repos,
                "contact_conversion_rate_percent": conversion_rate,
                "total_contact_submissions": contact_submissions
            }
