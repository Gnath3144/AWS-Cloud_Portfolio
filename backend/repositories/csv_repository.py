"""
backend/repositories/csv_repository.py - Thread-Safe CSV Implementation of BaseLeadRepository
"""
import os
import csv
import threading
from typing import List, Optional
from backend.models import LeadEntity
from backend.repositories.base import BaseLeadRepository

CSV_COLUMNS = [
    "id",
    "timestamp",
    "name",
    "email",
    "phone",
    "company",
    "service",
    "subject",
    "message",
    "contact_method",
    "ip_address",
    "browser",
    "status",
    "notes"
]

class CSVLeadRepository(BaseLeadRepository):
    def __init__(self, file_path: str):
        self.file_path = os.path.abspath(file_path)
        self.lock = threading.Lock()
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
        if not os.path.exists(self.file_path):
            with open(self.file_path, mode="w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow(CSV_COLUMNS)

    def _read_all_rows(self) -> List[dict]:
        self._ensure_file_exists()
        rows = []
        with open(self.file_path, mode="r", newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("id"):
                    rows.append(row)
        return rows

    def _write_all_rows(self, rows: List[dict]):
        with open(self.file_path, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
            writer.writeheader()
            for r in rows:
                clean_row = {k: r.get(k, "") for k in CSV_COLUMNS}
                writer.writerow(clean_row)

    def create(self, lead: LeadEntity) -> LeadEntity:
        with self.lock:
            self._ensure_file_exists()
            with open(self.file_path, mode="a", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
                lead_dict = lead.model_dump()
                writer.writerow(lead_dict)
        return lead

    def get_by_id(self, lead_id: str) -> Optional[LeadEntity]:
        with self.lock:
            rows = self._read_all_rows()
            for row in rows:
                if row.get("id") == lead_id:
                    return LeadEntity(**row)
        return None

    def list_all(
        self,
        search: Optional[str] = None,
        service: Optional[str] = None,
        status: Optional[str] = None,
        sort_by: str = "timestamp",
        order: str = "desc"
    ) -> List[LeadEntity]:
        with self.lock:
            rows = self._read_all_rows()

        entities = [LeadEntity(**r) for r in rows]

        # Filter by search
        if search:
            q = search.lower().strip()
            entities = [
                e for e in entities
                if q in e.name.lower() or q in e.email.lower() or q in e.company.lower() or q in e.subject.lower() or q in e.message.lower()
            ]

        # Filter by service
        if service and service.lower() != "all":
            entities = [e for e in entities if e.service.lower() == service.lower()]

        # Filter by status
        if status and status.lower() != "all":
            entities = [e for e in entities if e.status.lower() == status.lower()]

        # Sort
        reverse = order.lower() == "desc"
        if hasattr(LeadEntity, sort_by):
            entities.sort(key=lambda x: getattr(x, sort_by, ""), reverse=reverse)
        else:
            entities.sort(key=lambda x: x.timestamp, reverse=reverse)

        return entities

    def update(self, lead_id: str, status: Optional[str] = None, notes: Optional[str] = None) -> Optional[LeadEntity]:
        with self.lock:
            rows = self._read_all_rows()
            updated_entity = None
            for row in rows:
                if row.get("id") == lead_id:
                    if status:
                        row["status"] = status
                    if notes is not None:
                        row["notes"] = notes
                    updated_entity = LeadEntity(**row)
                    break
            
            if updated_entity:
                self._write_all_rows(rows)
            return updated_entity

    def delete(self, lead_id: str) -> bool:
        with self.lock:
            rows = self._read_all_rows()
            initial_count = len(rows)
            rows = [r for r in rows if r.get("id") != lead_id]
            if len(rows) < initial_count:
                self._write_all_rows(rows)
                return True
            return False

    def export_csv_raw(self) -> str:
        with self.lock:
            self._ensure_file_exists()
            with open(self.file_path, mode="r", newline="", encoding="utf-8") as f:
                return f.read()
