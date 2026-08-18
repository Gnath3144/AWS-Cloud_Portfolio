"""
backend/services/analytics_service.py - Visitor Analytics Service
"""
import logging
from typing import Dict, Any, Optional
from backend.repositories.analytics_repository import AnalyticsRepository

logger = logging.getLogger("analytics_service")

class AnalyticsService:
    def __init__(self, repository: Optional[AnalyticsRepository] = None):
        self.repo = repository or AnalyticsRepository()

    def track_session(self, session_data: Dict[str, Any]):
        try:
            self.repo.record_session(session_data)
        except Exception as e:
            logger.error(f"Error tracking analytics session: {e}")

    def track_event(self, session_id: str, event_type: str, event_target: str):
        try:
            self.repo.record_event(session_id, event_type, event_target)
        except Exception as e:
            logger.error(f"Error tracking analytics event: {e}")

    def get_dashboard_summary(self) -> Dict[str, Any]:
        try:
            return self.repo.get_analytics_summary()
        except Exception as e:
            logger.error(f"Error getting analytics dashboard summary: {e}")
            return {
                "total_visitors": 0,
                "unique_visitors": 0,
                "daily_visitors": 0,
                "weekly_visitors": 0,
                "monthly_visitors": 0,
                "contact_conversion_rate_percent": 0.0
            }
