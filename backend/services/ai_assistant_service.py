"""
backend/services/ai_assistant_service.py - Floating AI Assistant Intelligence Engine
"""
import re
import os
import json
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("ai_assistant")

class AIAssistantService:
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), "..", "..", "data")
        self.predefined_intents = [
            {
                "keywords": ["who is", "tell me about", "about gopinath", "gopinath", "bio", "experience"],
                "response": "Gopinath A is a Senior Technical Consultant, Principal Data Engineer, Generative AI Architect, and Creator of AKEF with 10+ years of experience across AWS Cloud, Databricks, PySpark, Snowflake, and enterprise bootcamps. He has trained over 5,000 engineers and architects globally.",
                "actions": [{"label": "View Experience", "target": "#journey"}]
            },
            {
                "keywords": ["akef", "ai knowledge", "rag framework", "knowledge engineering"],
                "response": "AKEF (AI Knowledge Engineering Framework) is an enterprise-grade autonomous RAG ingestion engine designed by Gopinath to chunk, embed, and query complex multi-format documents (PDFs, DOCX, Code) with sub-second hybrid vector search accuracy.",
                "actions": [{"label": "Explore AKEF Architecture", "target": "#akef"}, {"label": "GitHub Repo", "target": "https://github.com/Gnath3144/AKEF-AI-Knowledge-Engine", "external": True}]
            },
            {
                "keywords": ["data engineering", "projects", "show projects", "portfolio", "medallion", "databricks"],
                "response": "Gopinath has architected key enterprise projects including the Databricks Medallion Lakehouse Engine (Bronze/Silver/Gold Delta Lake), AWS Cloud Security Audit System, and Executive Power BI Analytics suite.",
                "actions": [{"label": "Browse Flagship Projects", "target": "#what-i-build"}]
            },
            {
                "keywords": ["training", "bootcamp", "courses", "fdp", "faculty", "workshops", "programs"],
                "response": "Available training programs include Corporate Databricks & PySpark Masterclasses, Executive GenAI & RAG Workshops, Faculty Development Programs (FDP), and Cybersecurity Awareness Certifications.",
                "actions": [{"label": "View Services & Training", "target": "#services"}, {"label": "Download Course Catalog", "target": "/downloads/course-catalog.pdf", "external": True}]
            },
            {
                "keywords": ["resume", "download resume", "cv", "profile pdf"],
                "response": "You can download Gopinath's official executive resume and enterprise portfolio directly from the downloads center.",
                "actions": [{"label": "Download Executive Resume", "target": "/downloads/gopinath-resume.pdf", "external": True}]
            },
            {
                "keywords": ["contact", "hire", "consulting", "email", "reach out", "book"],
                "response": "You can contact Gopinath directly via the site contact form or by emailing gnath3144@gmail.com for enterprise consulting, corporate training, or keynote speaking engagements.",
                "actions": [{"label": "Go to Contact Form", "target": "#contact"}]
            }
        ]

    def query(self, user_text: str) -> Dict[str, Any]:
        text_clean = user_text.strip().lower()

        # 1. Match predefined pattern intents
        for intent in self.predefined_intents:
            for kw in intent["keywords"]:
                if kw in text_clean:
                    return {
                        "source": "predefined_json",
                        "answer": intent["response"],
                        "actions": intent.get("actions", []),
                        "confidence": 0.95
                    }

        # 2. Search CMS JSON data for matching keywords
        cms_match = self._search_cms_data(text_clean)
        if cms_match:
            return {
                "source": "cms_search",
                "answer": cms_match["answer"],
                "actions": cms_match.get("actions", []),
                "confidence": 0.85
            }

        # 3. Default fallback response with suggested prompts
        return {
            "source": "default_fallback",
            "answer": "I am Gopinath's AI Assistant! I can tell you about his enterprise projects, AKEF framework, Databricks expertise, corporate training programs, or help you download his resume.",
            "suggested_prompts": [
                "Tell me about Gopinath.",
                "Explain AKEF.",
                "Show Data Engineering projects.",
                "What training programs are available?",
                "Download resume.",
                "Contact Gopinath."
            ],
            "confidence": 0.5
        }

    def _search_cms_data(self, query: str) -> Optional[Dict[str, Any]]:
        try:
            projects_file = os.path.join(self.data_dir, "projects.json")
            if os.path.exists(projects_file):
                with open(projects_file, "r", encoding="utf-8") as f:
                    projects = json.load(f)
                    for p in projects:
                        if any(term in query for term in [p["title"].lower(), p["category"].lower(), p["id"].lower()]):
                            return {
                                "answer": f"Project: {p['title']} — {p['tagline']}. Executive Summary: {p['executiveSummary']}",
                                "actions": [{"label": "View Project Details", "target": "#what-i-build"}]
                            }
        except Exception as e:
            logger.error(f"Error searching CMS data for AI Assistant: {e}")
        return None
