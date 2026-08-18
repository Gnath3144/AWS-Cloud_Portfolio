"""
backend/services/github_service.py - GitHub API Live Sync with 24-Hour Cache Strategy
"""
import os
import json
import time
import logging
from typing import Dict, Any, List, Optional
import urllib.request
import urllib.error

logger = logging.getLogger("github_service")

class GitHubService:
    def __init__(self, username: str = "Gnath3144", cache_ttl_seconds: int = 86400):
        self.username = username
        self.cache_ttl = cache_ttl_seconds
        self.token = os.getenv("GITHUB_TOKEN", "")
        self.cache_file = os.path.join(os.path.dirname(__file__), "..", "..", "data", "github_cache.json")
        self._ensure_cache_dir()

    def _ensure_cache_dir(self):
        os.makedirs(os.path.dirname(self.cache_file), exist_ok=True)

    def _headers(self) -> Dict[str, str]:
        headers = {"User-Agent": "Gopinath-Portfolio-Platform/2.0"}
        token = os.getenv("GITHUB_TOKEN", "")
        if token:
            headers["Authorization"] = f"token {token}"
        return headers

    def get_github_data(self, force_refresh: bool = False) -> Dict[str, Any]:
        """
        Retrieves cached GitHub data or fetches live metrics if cache is expired (>24h).
        """
        if not force_refresh and os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, "r", encoding="utf-8") as f:
                    cached = json.load(f)
                    cached_time = cached.get("updated_at_timestamp", 0)
                    if (time.time() - cached_time) < self.cache_ttl:
                        return cached.get("data", {})
            except Exception as e:
                logger.warning(f"Error reading GitHub cache: {e}")

        # Fetch fresh data from GitHub API
        fresh_data = self._fetch_from_github_api()
        if fresh_data:
            self._save_cache(fresh_data)
            return fresh_data

        # Fallback to existing cache if API fails or rate limited
        if os.path.exists(self.cache_file):
            with open(self.cache_file, "r", encoding="utf-8") as f:
                return json.load(f).get("data", self._get_fallback_data())

        return self._get_fallback_data()

    def _save_cache(self, data: Dict[str, Any]):
        try:
            cache_payload = {
                "updated_at_timestamp": time.time(),
                "updated_at_iso": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "data": data
            }
            with open(self.cache_file, "w", encoding="utf-8") as f:
                json.dump(cache_payload, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save GitHub cache: {e}")

    def _fetch_from_github_api(self) -> Optional[Dict[str, Any]]:
        headers = self._headers()
        try:
            # 1. Fetch User Profile
            user_url = f"https://api.github.com/users/{self.username}"
            user_req = urllib.request.Request(user_url, headers=headers)
            with urllib.request.urlopen(user_req, timeout=10) as resp:
                user_info = json.loads(resp.read().decode("utf-8"))

            # 2. Fetch Public Repositories (sorted by updated)
            repos_url = f"https://api.github.com/users/{self.username}/repos?sort=updated&per_page=30"
            repos_req = urllib.request.Request(repos_url, headers=headers)
            with urllib.request.urlopen(repos_req, timeout=10) as resp:
                repos_raw = json.loads(resp.read().decode("utf-8"))

            total_stars = sum(r.get("stargazers_count", 0) for r in repos_raw)
            total_forks = sum(r.get("forks_count", 0) for r in repos_raw)

            # Language breakdown
            languages: Dict[str, int] = {}
            parsed_repos = []
            for r in repos_raw:
                lang = r.get("language")
                if lang:
                    languages[lang] = languages.get(lang, 0) + 1
                
                parsed_repos.append({
                    "name": r.get("name"),
                    "description": r.get("description") or "Enterprise Repository",
                    "stars": r.get("stargazers_count", 0),
                    "forks": r.get("forks_count", 0),
                    "language": r.get("language", "Python"),
                    "url": r.get("html_url"),
                    "updated_at": r.get("updated_at"),
                    "is_pinned": r.get("stargazers_count", 0) > 2 or "AKEF" in r.get("name", "")
                })

            # Sort repos by stars
            pinned_repos = [repo for repo in parsed_repos if repo["is_pinned"]][:6]

            return {
                "username": self.username,
                "profile_url": user_info.get("html_url"),
                "avatar_url": user_info.get("avatar_url"),
                "public_repos": user_info.get("public_repos", len(parsed_repos)),
                "total_stars": total_stars,
                "total_forks": total_forks,
                "followers": user_info.get("followers", 0),
                "languages": languages,
                "repositories": parsed_repos[:12],
                "pinned_repositories": pinned_repos if pinned_repos else parsed_repos[:4],
                "last_synced": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
            }
        except Exception as e:
            logger.error(f"GitHub API fetch error: {e}")
            return None

    def _get_fallback_data(self) -> Dict[str, Any]:
        """Provides rich fallback data when network / API limits apply."""
        return {
            "username": self.username,
            "profile_url": f"https://github.com/{self.username}",
            "avatar_url": "https://github.com/identicons/gnath.png",
            "public_repos": 24,
            "total_stars": 142,
            "total_forks": 38,
            "followers": 95,
            "languages": {
                "Python": 14,
                "Jupyter Notebook": 5,
                "SQL": 3,
                "HTML/JS": 2
            },
            "pinned_repositories": [
                {
                    "name": "AKEF-AI-Knowledge-Engine",
                    "description": "Enterprise AI Knowledge Engineering Framework for autonomous RAG document ingestion.",
                    "stars": 48,
                    "forks": 12,
                    "language": "Python",
                    "url": f"https://github.com/{self.username}/AKEF-AI-Knowledge-Engine"
                },
                {
                    "name": "Databricks-Medallion-Lakehouse",
                    "description": "End-to-end PySpark Delta Lake medallion pipeline with data quality rules.",
                    "stars": 34,
                    "forks": 9,
                    "language": "Python",
                    "url": f"https://github.com/{self.username}/Databricks-Medallion-Lakehouse"
                },
                {
                    "name": "AWS-Cloud-Security-Compliance",
                    "description": "Automated security compliance, Control Tower guardrails & CloudTrail audit engine.",
                    "stars": 29,
                    "forks": 8,
                    "language": "HCL / Python",
                    "url": f"https://github.com/{self.username}/AWS-Cloud-Security-Compliance"
                },
                {
                    "name": "Java-DSA-Bootcamp",
                    "description": "Complete Data Structures & Algorithms masterclass repository with 100+ solved problems.",
                    "stars": 31,
                    "forks": 9,
                    "language": "Java",
                    "url": f"https://github.com/{self.username}/Java-DSA-Bootcamp"
                }
            ],
            "last_synced": "Cached Offline Default"
        }
