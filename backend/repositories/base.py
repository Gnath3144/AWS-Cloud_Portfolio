"""
backend/repositories/base.py - Abstract Repository Interface
Allows seamless future migration from CSV to SQLite/PostgreSQL/MongoDB without modifying API routes.
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from backend.models import LeadEntity

class BaseLeadRepository(ABC):
    @abstractmethod
    def create(self, lead: LeadEntity) -> LeadEntity:
        """Store a new lead record."""
        pass

    @abstractmethod
    def get_by_id(self, lead_id: str) -> Optional[LeadEntity]:
        """Retrieve a specific lead by reference ID."""
        pass

    @abstractmethod
    def list_all(
        self,
        search: Optional[str] = None,
        service: Optional[str] = None,
        status: Optional[str] = None,
        sort_by: str = "timestamp",
        order: str = "desc"
    ) -> List[LeadEntity]:
        """List leads with filtering, search, and sorting."""
        pass

    @abstractmethod
    def update(self, lead_id: str, status: Optional[str] = None, notes: Optional[str] = None) -> Optional[LeadEntity]:
        """Update lead status or admin notes."""
        pass

    @abstractmethod
    def delete(self, lead_id: str) -> bool:
        """Delete a lead record."""
        pass

    @abstractmethod
    def export_csv_raw(self) -> str:
        """Export all lead data as raw CSV text."""
        pass
