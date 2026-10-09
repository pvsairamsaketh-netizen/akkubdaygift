"""
Tavily Web Search Service for Akku AI.
Provides fallback external search strictly for general, current, or external queries.
Strict Safety Rule: NEVER search web for private relationship questions or personal memories.
"""

import os
import logging
import requests
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class TavilyService:
    _instance: Optional['TavilyService'] = None

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('TAVILY_API_KEY', '')
        self.endpoint = "https://api.tavily.com/search"

    @classmethod
    def get_instance(cls) -> 'TavilyService':
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    @classmethod
    def is_available(cls) -> bool:
        return cls.get_instance().is_enabled()

    def is_enabled(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    def search(self, query: str, max_results: int = 3) -> List[Dict[str, Any]]:
        """
        Executes web search for non-personal, general queries.
        Returns list of results: [{'title': ..., 'url': ..., 'content': ...}]
        """
        if not self.is_enabled():
            return []

        try:
            payload = {
                "api_key": self.api_key,
                "query": query,
                "search_depth": "basic",
                "include_answer": True,
                "max_results": max_results
            }
            resp = requests.post(self.endpoint, json=payload, timeout=5.0)
            if resp.status_code == 200:
                data = resp.json()
                results = []
                for item in data.get("results", []):
                    results.append({
                        "title": item.get("title", ""),
                        "url": item.get("url", ""),
                        "content": item.get("content", "")
                    })
                return results
            else:
                logger.warning(f"Tavily search returned status {resp.status_code}: {resp.text}")
                return []
        except Exception as e:
            logger.warning(f"Tavily web search error: {e}")
            return []
