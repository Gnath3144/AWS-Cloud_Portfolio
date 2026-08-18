"""
backend/models.py - Pydantic Data Models & Schemas with Built-in Regex Email Validation
"""
import re
from typing import Optional, Literal
from datetime import datetime, timezone
from pydantic import BaseModel, Field, field_validator

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

class ContactSubmissionRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full Name")
    email: str = Field(..., description="Valid Email Address")
    company: Optional[str] = Field(None, max_length=120, description="Company / Organization")
    phone: Optional[str] = Field(None, max_length=30, description="Phone Number")
    service: str = Field("Data Engineering Consulting", description="Service Required")
    subject: str = Field(..., min_length=3, max_length=150, description="Inquiry Subject")
    message: str = Field(..., min_length=10, max_length=3000, description="Detailed Message")
    contact_method: str = Field("Email", description="Preferred Contact Method")
    honeypot: Optional[str] = Field(None, description="Anti-spam honeypot field")

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean = v.strip().lower()
        if not EMAIL_REGEX.match(clean):
            raise ValueError("Invalid email format")
        return clean

class LeadEntity(BaseModel):
    id: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    name: str
    email: str
    phone: str = ""
    company: str = ""
    service: str
    subject: str
    message: str
    contact_method: str
    ip_address: str = "Unknown"
    browser: str = "Unknown"
    status: Literal["New", "Contacted", "Closed"] = "New"
    notes: str = ""

class LeadStatusUpdateRequest(BaseModel):
    status: Optional[Literal["New", "Contacted", "Closed"]] = None
    notes: Optional[str] = None

class ContactResponse(BaseModel):
    success: bool
    reference_id: str
    message: str
