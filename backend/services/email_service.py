"""
backend/services/email_service.py - Email Notification Service with Graceful Fallback
"""
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from backend.config import settings
from backend.models import LeadEntity

logger = logging.getLogger("email_service")

class EmailService:
    @staticmethod
    def send_lead_notifications(lead: LeadEntity):
        if not settings.smtp_enabled:
            logger.info(f"[Email Notification Simulation] New Lead: {lead.id} from {lead.name} ({lead.email})")
            return

        try:
            # 1. Send Notification to Portfolio Owner
            EmailService._send_owner_alert(lead)
            # 2. Send Receipt Confirmation to Visitor
            EmailService._send_visitor_confirmation(lead)
        except Exception as e:
            logger.error(f"Failed to send email notifications: {e}")

    @staticmethod
    def _send_owner_alert(lead: LeadEntity):
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"🔥 New Portfolio Lead [{lead.id}]: {lead.subject}"
        msg["From"] = settings.smtp_user
        msg["To"] = settings.notification_recipient_email

        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0284c7;">New Lead Received on Gopinath.dev</h2>
            <p><strong>Reference ID:</strong> {lead.id}</p>
            <p><strong>Name:</strong> {lead.name}</p>
            <p><strong>Email:</strong> {lead.email}</p>
            <p><strong>Phone:</strong> {lead.phone or 'Not provided'}</p>
            <p><strong>Company:</strong> {lead.company or 'Not provided'}</p>
            <p><strong>Service:</strong> {lead.service}</p>
            <p><strong>Preferred Contact:</strong> {lead.contact_method}</p>
            <p><strong>Subject:</strong> {lead.subject}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0;"/>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f8fafc; padding: 12px; border-left: 4px solid #0284c7;">
                {lead.message}
            </blockquote>
            <p style="font-size: 12px; color: #64748b;">Submitted at {lead.timestamp} from IP {lead.ip_address}</p>
        </body>
        </html>
        """
        msg.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)

    @staticmethod
    def _send_visitor_confirmation(lead: LeadEntity):
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Thank you for contacting Gopinath [Ref: {lead.id}]"
        msg["From"] = settings.smtp_user
        msg["To"] = lead.email

        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0284c7;">Hello {lead.name},</h2>
            <p>Thank you for reaching out! Your inquiry regarding <strong>{lead.service}</strong> has been successfully received.</p>
            <p><strong>Reference ID:</strong> <code>{lead.id}</code></p>
            <p>I will review your message and get back to you via <strong>{lead.contact_method}</strong> shortly.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0;"/>
            <p style="font-size: 12px; color: #64748b;">Gopinath &bull; Senior Data Engineer &amp; Cloud Architect</p>
        </body>
        </html>
        """
        msg.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
