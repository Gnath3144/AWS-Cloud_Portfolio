"""
scripts/generate_resume_pdf.py - Automated Master Resume HTML & PDF Compiler
Compiles data/*.json into a styled executive PDF/HTML resume.
"""

import os
import json

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(ROOT_DIR, "data")
OUTPUT_DIR = os.path.join(ROOT_DIR, "downloads")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_data(filename):
    with open(os.path.join(DATA_DIR, filename), "r", encoding="utf-8") as f:
        return json.load(f)

def generate_resume_html():
    profile = load_data("profile.json")
    experience = load_data("experience.json")
    education = load_data("education.json")
    certifications = load_data("certifications.json")
    skills = load_data("skills.json")

    skills_html = ""
    for cat in skills.get("categories", []):
        skill_names = ", ".join([s["name"] for s in cat["skills"]])
        skills_html += f"""
        <div style="margin-bottom: 10px;">
            <strong style="color: #0f172a; font-size: 13px;">{cat['name']}:</strong>
            <span style="color: #334155; font-size: 13px;">{skill_names}</span>
        </div>
        """

    exp_html = ""
    for exp in experience:
        highlights_li = "".join([f"<li style='margin-bottom: 4px;'>{h}</li>" for h in exp.get("highlights", [])])
        exp_html += f"""
        <div style="margin-bottom: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
                <h3 style="margin: 0; font-size: 15px; color: #0f172a; font-weight: 700;">{exp['role']}</h3>
                <span style="font-size: 12px; color: #64748b; font-weight: 600;">{exp['period']}</span>
            </div>
            <div style="font-size: 13px; color: #ea580c; font-weight: 600; margin-bottom: 6px;">{exp['organization']} &bull; {exp.get('location', '')}</div>
            <p style="font-size: 13px; color: #334155; line-height: 1.5; margin: 0 0 6px 0;">{exp.get('summary', '')}</p>
            <ul style="margin: 0; padding-left: 18px; font-size: 12.5px; color: #475569; line-height: 1.5;">
                {highlights_li}
            </ul>
        </div>
        """

    certs_html = ""
    for c in certifications.get("certifications", []):
        certs_html += f"""
        <div style="margin-bottom: 6px; font-size: 13px; color: #334155;">
            <strong>{c['title']}</strong> &bull; <span style="color: #64748b;">{c['issuer']} ({c['issueDate']})</span>
        </div>
        """

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{profile['name']} - Executive Technical Resume</title>
    <style>
        @page {{ size: A4; margin: 16mm; }}
        body {{
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #0f172a;
            line-height: 1.45;
            margin: 0;
            padding: 0;
            background: #fff;
        }}
        .header {{
            border-bottom: 2px solid #ea580c;
            padding-bottom: 14px;
            margin-bottom: 16px;
        }}
        .name {{
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 4px 0;
            letter-spacing: -0.02em;
        }}
        .title {{
            font-size: 14px;
            color: #ea580c;
            font-weight: 700;
            margin: 0 0 8px 0;
        }}
        .contact-bar {{
            font-size: 12px;
            color: #475569;
        }}
        .section-title {{
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #0f172a;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 4px;
            margin: 16px 0 10px 0;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1 class="name">{profile['name']}</h1>
        <div class="title">{profile['title']}</div>
        <div class="contact-bar">
            {profile.get('location', 'Bengaluru, India')} &bull; 
            {profile.get('email', 'gnath3144@gmail.com')} &bull; 
            <a href="{profile.get('github', '')}" style="color: #ea580c; text-decoration: none;">GitHub</a> &bull; 
            <a href="{profile.get('linkedin', '')}" style="color: #ea580c; text-decoration: none;">LinkedIn</a> &bull; 
            10+ Years Experience
        </div>
    </div>

    <div class="section-title">Executive Summary</div>
    <p style="font-size: 13px; color: #334155; line-height: 1.55; margin: 0 0 14px 0;">
        {profile.get('bio', '')}
    </p>

    <div class="section-title">Technical Competencies</div>
    {skills_html}

    <div class="section-title">Professional Experience</div>
    {exp_html}

    <div class="section-title">Certifications &amp; Credentials</div>
    {certs_html}
</body>
</html>"""

    html_file = os.path.join(OUTPUT_DIR, "gopinath-resume.html")
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"[SUCCESS] Successfully generated printable HTML resume at: {html_file}")

if __name__ == "__main__":
    generate_resume_html()
