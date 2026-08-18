"""
backend/lambda_contact_handler.py - Serverless AWS Lambda Contact & Lead Ingestion Handler
Provides 100% serverless contact form submission and lead storage in S3.
Cost: $0.00 / month (under AWS Lambda 1,000,000 requests/month Free Tier).
"""
import json
import uuid
import time
import os
import boto3

s3_client = boto3.client('s3')
BUCKET_NAME = os.environ.get('PORTFOLIO_S3_BUCKET', 'gopinath-cloud-portfolio-724394717120')

def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Admin-Key",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Content-Type": "application/json"
    }

    # Handle OPTIONS pre-flight
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"status": "ok"})}

    try:
        body_raw = event.get("body", "{}")
        if event.get("isBase64Encoded", False):
            import base64
            body_raw = base64.b64decode(body_raw).decode('utf-8')

        data = json.loads(body_raw) if body_raw else {}

        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        company = data.get("company", "").strip()
        message = data.get("message", "").strip()
        service_interest = data.get("service_interest", "General Inquiry").strip()

        if not name or not email or not message:
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"status": "error", "message": "Name, email, and message are required."})
            }

        lead_id = str(uuid.uuid4())
        timestamp = int(time.time())

        lead_record = {
            "lead_id": lead_id,
            "timestamp": timestamp,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(timestamp)),
            "name": name,
            "email": email,
            "company": company or "N/A",
            "service_interest": service_interest,
            "message": message,
            "source": "AWS Lambda Serverless Gateway"
        }

        # Store lead object in S3
        s3_key = f"contacts/{time.strftime('%Y/%m/%d')}/{timestamp}_{lead_id[:8]}.json"
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=s3_key,
            Body=json.dumps(lead_record, indent=2),
            ContentType="application/json"
        )

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "status": "success",
                "message": "Thank you! Your message has been safely received.",
                "lead_id": lead_id
            })
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"status": "error", "message": f"Internal server error: {str(e)}"})
        }
