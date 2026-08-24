import json
import os

data_path = os.path.join(os.path.dirname(__file__), "..", "data", "architecture_details.json")
with open(data_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# 1. Enrich aws-lakehouse
if "aws-lakehouse" in data:
    data["aws-lakehouse"]["codeExplorer"]["Terraform (IaC)"] = """# AWS S3 Medallion Lakehouse & Glue Catalog (IaC)
resource "aws_s3_bucket" "lakehouse_raw" {
  bucket = "enterprise-lakehouse-raw-bronze"
}

resource "aws_s3_bucket_lifecycle_configuration" "lakehouse_lifecycle" {
  bucket = aws_s3_bucket.lakehouse_raw.id
  rule {
    id     = "intelligent-tiering-transition"
    status = "Enabled"
    transition {
      days          = 30
      storage_class = "INTELLIGENT_TIERING"
    }
  }
}

resource "aws_glue_catalog_database" "lakehouse_db" {
  name = "enterprise_analytics_silver"
}"""
    data["aws-lakehouse"]["performanceDashboard"]["finopsSavings"] = "42% Cost Saved via S3 Intelligent-Tiering & Snappy Compaction"

# 2. Enrich security
if "security" in data:
    data["security"]["codeExplorer"]["Terraform (IaC)"] = """# AWS Zero-Trust IAM & GuardDuty Enforcer
resource "aws_guardduty_detector" "primary" {
  enable = true
  finding_publishing_frequency = "FIFTEEN_MINUTES"
}

resource "aws_iam_policy" "strict_least_privilege" {
  name        = "EnterpriseLeastPrivilegePolicy"
  description = "Zero-Trust Least Privilege Role with TLS Constraints"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject", "s3:ListBucket"]
      Resource = ["arn:aws:s3:::lakehouse-gold/*"]
      Condition = {
        Bool = { "aws:SecureTransport": "true" }
      }
    }]
  })
}"""
    data["security"]["performanceDashboard"]["finopsSavings"] = "100% Automated Policy Enforcement & Zero-Trust Auditability"

# 3. Enrich databricks
if "databricks" in data:
    data["databricks"]["codeExplorer"]["Terraform (IaC)"] = """# Databricks Unity Catalog & Delta Live Tables (IaC)
resource "databricks_catalog" "sandbox" {
  name    = "enterprise_gold"
  comment = "Production Gold Analytics Catalog with Unity Catalog RBAC"
}

resource "databricks_schema" "financials" {
  catalog_name = databricks_catalog.sandbox.name
  name         = "financial_reporting"
}"""
    data["databricks"]["performanceDashboard"]["finopsSavings"] = "35% Cluster Compute Saved via Photon Engine & Autoscaling"

with open(data_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Successfully enriched architecture_details.json!")
