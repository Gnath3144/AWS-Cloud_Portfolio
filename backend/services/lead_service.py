"""
backend/services/lead_service.py - Lead Service Business Logic
"""
import os
import csv
import time
import html
import random
import string
import logging
from typing import Dict, List, Optional
from backend.models import ContactSubmissionRequest, LeadEntity, LeadStatusUpdateRequest
from backend.repositories.base import BaseLeadRepository
from backend.services.email_service import EmailService
from backend.config import settings

logger = logging.getLogger("lead_service")

# In-memory IP rate limiter: { ip_address: [timestamp1, timestamp2, ...] }
_rate_limits: Dict[str, List[float]] = {}

class LeadService:
    def __init__(self, repository: BaseLeadRepository):
        self.repo = repository

    def _is_rate_limited(self, ip_address: str) -> bool:
        now = time.time()
        window = settings.rate_limit_window_seconds
        max_requests = settings.rate_limit_requests

        timestamps = _rate_limits.get(ip_address, [])
        # filter out timestamps older than window
        timestamps = [t for t in timestamps if now - t < window]
        _rate_limits[ip_address] = timestamps

        if len(timestamps) >= max_requests:
            return True

        timestamps.append(now)
        _rate_limits[ip_address] = timestamps
        return False

    def _generate_reference_id(self) -> str:
        chars = string.ascii_uppercase + string.digits
        random_suffix = ''.join(random.choices(chars, k=8))
        return f"REF-{random_suffix}"

    def _sync_to_contact_messages_csv(self, lead: LeadEntity):
        """Also sync to data/contact_messages.csv as requested"""
        try:
            workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            data_dir = os.path.join(workspace_root, "data")
            os.makedirs(data_dir, exist_ok=True)
            csv_path = os.path.join(data_dir, "contact_messages.csv")
            file_exists = os.path.isfile(csv_path)

            fieldnames = ["Timestamp", "Name", "Email", "Phone", "Company", "Subject", "Message", "ReferenceID", "Service", "Status"]
            with open(csv_path, mode="a", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                if not file_exists:
                    writer.writeheader()
                writer.writerow({
                    "Timestamp": lead.timestamp,
                    "Name": lead.name,
                    "Email": lead.email,
                    "Phone": lead.phone,
                    "Company": lead.company,
                    "Subject": lead.subject,
                    "Message": lead.message,
                    "ReferenceID": lead.id,
                    "Service": lead.service,
                    "Status": lead.status
                })
        except Exception as e:
            logger.error(f"Failed to sync to contact_messages.csv: {e}")

    def process_submission(
        self,
        req: ContactSubmissionRequest,
        ip_address: str = "Unknown",
        user_agent: str = "Unknown"
    ) -> LeadEntity:
        # 1. Honeypot check (anti-spam trap)
        if req.honeypot and req.honeypot.strip():
            logger.warning(f"Honeypot triggered from IP {ip_address}. Silently generating dummy record.")
            return LeadEntity(
                id=self._generate_reference_id(),
                name=req.name,
                email=req.email,
                service=req.service,
                subject=req.subject,
                message=req.message,
                contact_method=req.contact_method
            )

        # 2. Rate limiting check
        if self._is_rate_limited(ip_address):
            logger.warning(f"Rate limit exceeded for IP: {ip_address}")
            raise ValueError("Too many requests from your IP. Please wait a minute before submitting again.")

        # 3. Sanitize inputs
        clean_name = html.escape(req.name.strip())
        clean_email = req.email.strip().lower()
        clean_company = html.escape(req.company.strip()) if req.company else ""
        clean_phone = html.escape(req.phone.strip()) if req.phone else ""
        clean_subject = html.escape(req.subject.strip())
        clean_message = html.escape(req.message.strip())
        clean_service = html.escape(req.service.strip())
        clean_contact_method = html.escape(req.contact_method.strip())

        # 4. Construct Lead Entity
        lead = LeadEntity(
            id=self._generate_reference_id(),
            name=clean_name,
            email=clean_email,
            phone=clean_phone,
            company=clean_company,
            service=clean_service,
            subject=clean_subject,
            message=clean_message,
            contact_method=clean_contact_method,
            ip_address=ip_address,
            browser=user_agent,
            status="New"
        )

        # 5. Persist to Repository & secondary CSV
        saved_lead = self.repo.create(lead)
        self._sync_to_contact_messages_csv(saved_lead)

        # 6. Dispatch asynchronous email notification
        EmailService.send_lead_notifications(saved_lead)

        return saved_lead

    def list_leads(
        self,
        search: Optional[str] = None,
        service: Optional[str] = None,
        status: Optional[str] = None,
        sort_by: str = "timestamp",
        order: str = "desc"
    ) -> List[LeadEntity]:
        return self.repo.list_all(
            search=search,
            service=service,
            status=status,
            sort_by=sort_by,
            order=order
        )

    def get_lead(self, lead_id: str) -> Optional[LeadEntity]:
        return self.repo.get_by_id(lead_id)

    def update_lead(self, lead_id: str, update_req: LeadStatusUpdateRequest) -> Optional[LeadEntity]:
        return self.repo.update(
            lead_id=lead_id,
            status=update_req.status,
            notes=update_req.notes
        )

    def delete_lead(self, lead_id: str) -> bool:
        return self.repo.delete(lead_id)

    def export_csv(self) -> str:
        return self.repo.export_csv_raw()
