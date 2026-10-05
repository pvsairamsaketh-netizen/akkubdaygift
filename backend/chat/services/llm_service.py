"""
LLM Generation Service for Saki & Akku Relationship Assistant.
Supports:
1. Local Ollama (Qwen 3, Qwen 2.5)
2. OpenAI-compatible endpoints (vLLM, Groq, DeepInfra, OpenAI)
3. Configurable through environment variables:
   - LLM_PROVIDER (ollama | openai | custom)
   - LLM_MODEL (e.g. qwen3:8b, qwen2.5:3b)
   - LLM_BASE_URL
   - LLM_API_KEY
4. Streaming SSE and non-streaming generation with keep-alive and error resilience.
"""

import os
import json
import logging
import requests
from typing import List, Dict, Any, Generator, Optional
from django.conf import settings

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(
        self,
        provider: Optional[str] = None,
        base_url: Optional[str] = None,
        model_name: Optional[str] = None,
        api_key: Optional[str] = None,
        temperature: Optional[float] = None,
        num_ctx: Optional[int] = None,
        max_tokens: Optional[int] = None,
        keep_alive: Optional[str] = None
    ):
        self.provider = provider or os.getenv('LLM_PROVIDER', 'ollama').lower()
        self.base_url = (
            base_url or
            os.getenv('LLM_BASE_URL') or
            getattr(settings, 'OLLAMA_BASE_URL', 'http://localhost:11434')
        ).rstrip('/')
        
        # Target model: check LLM_MODEL, OLLAMA_MODEL, or default to qwen3:8b if available, else qwen2.5:3b
        env_model = os.getenv('LLM_MODEL') or os.getenv('OLLAMA_MODEL') or getattr(settings, 'OLLAMA_MODEL', 'qwen2.5:3b')
        self.model_name = model_name or env_model
        self.api_key = api_key or os.getenv('LLM_API_KEY', '')

        self.temperature = temperature if temperature is not None else float(getattr(settings, 'OLLAMA_TEMPERATURE', 0.3))
        self.top_p = float(getattr(settings, 'OLLAMA_TOP_P', 0.9))
        self.repeat_penalty = float(getattr(settings, 'OLLAMA_REPEAT_PENALTY', 1.15))
        self.num_ctx = num_ctx or int(getattr(settings, 'OLLAMA_NUM_CTX', 2048))
        self.max_tokens = max_tokens or int(getattr(settings, 'OLLAMA_MAX_TOKENS', 400))
        self.keep_alive = keep_alive or getattr(settings, 'OLLAMA_KEEP_ALIVE', '30m')
        self.session = requests.Session()
        self._available_models_cache: Optional[List[str]] = None

    def is_available(self) -> bool:
        """Checks if LLM server is accessible."""
        if self.provider == "ollama":
            try:
                resp = self.session.get(f"{self.base_url}/api/tags", timeout=2.0)
                return resp.status_code == 200
            except Exception:
                return False
        return True

    def list_models(self) -> List[str]:
        """Returns list of downloaded Ollama models with caching."""
        if self._available_models_cache is not None:
            return self._available_models_cache
        if self.provider == "ollama":
            try:
                resp = self.session.get(f"{self.base_url}/api/tags", timeout=2.0)
                if resp.status_code == 200:
                    data = resp.json()
                    models = [m.get("name") for m in data.get("models", [])]
                    self._available_models_cache = models
                    return models
            except Exception as e:
                logger.warning(f"Could not fetch Ollama models: {e}")
        return [self.model_name]

    def get_optimal_model(self, question_type: str = "simple") -> str:
        """
        Dynamically selects model based on availability and configuration:
        - If Qwen3-8B is configured and available in Ollama, prefers Qwen3-8B.
        - Falls back gracefully to configured model or available model in Ollama.
        """
        models = self.list_models()
        # If user explicitly requested a model that exists, use it
        for target in [self.model_name, "qwen3:8b", "qwen3-8b", "qwen2.5:3b", "qwen2.5:1.5b"]:
            if any(target in m for m in models):
                return next(m for m in models if target in m)
        return models[0] if models else self.model_name

    def generate(
        self,
        messages: List[Dict[str, str]],
        model_name: Optional[str] = None,
        max_tokens: Optional[int] = None,
        num_ctx: Optional[int] = None,
        temperature: Optional[float] = None
    ) -> str:
        """Synchronously generates complete response."""
        chosen_model = model_name or self.get_optimal_model()
        ctx = num_ctx or self.num_ctx
        predict = max_tokens or self.max_tokens
        temp = temperature if temperature is not None else self.temperature

        if self.provider == "ollama":
            payload = {
                "model": chosen_model,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": temp,
                    "top_p": self.top_p,
                    "repeat_penalty": self.repeat_penalty,
                    "num_ctx": ctx,
                    "num_predict": predict
                },
                "keep_alive": self.keep_alive
            }
            resp = self.session.post(f"{self.base_url}/api/chat", json=payload, timeout=45.0)
            if resp.status_code == 200:
                data = resp.json()
                return data.get("message", {}).get("content", "").strip()
            raise RuntimeError(f"Ollama generation failed ({resp.status_code}): {resp.text}")

        # OpenAI-compatible provider
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        payload = {
            "model": chosen_model,
            "messages": messages,
            "temperature": temp,
            "max_tokens": predict,
            "stream": False
        }
        resp = self.session.post(f"{self.base_url}/v1/chat/completions", json=payload, headers=headers, timeout=45.0)
        if resp.status_code == 200:
            data = resp.json()
            return data["choices"][0]["message"]["content"].strip()
        raise RuntimeError(f"LLM API generation failed ({resp.status_code}): {resp.text}")

    def generate_stream(
        self,
        messages: List[Dict[str, str]],
        model_name: Optional[str] = None,
        max_tokens: Optional[int] = None,
        num_ctx: Optional[int] = None,
        temperature: Optional[float] = None
    ) -> Generator[str, None, None]:
        """Streams response tokens from LLM."""
        chosen_model = model_name or self.get_optimal_model()
        ctx = num_ctx or self.num_ctx
        predict = max_tokens or self.max_tokens
        temp = temperature if temperature is not None else self.temperature

        if self.provider == "ollama":
            payload = {
                "model": chosen_model,
                "messages": messages,
                "stream": True,
                "options": {
                    "temperature": temp,
                    "top_p": self.top_p,
                    "repeat_penalty": self.repeat_penalty,
                    "num_ctx": ctx,
                    "num_predict": predict
                },
                "keep_alive": self.keep_alive
            }
            resp = self.session.post(f"{self.base_url}/api/chat", json=payload, stream=True, timeout=45.0)
            if resp.status_code != 200:
                raise RuntimeError(f"Ollama streaming failed ({resp.status_code}): {resp.text}")
            for line in resp.iter_lines():
                if line:
                    chunk = json.loads(line.decode('utf-8'))
                    delta = chunk.get("message", {}).get("content", "")
                    if delta:
                        yield delta
                    if chunk.get("done", False):
                        break
            return

        # OpenAI-compatible streaming
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        payload = {
            "model": chosen_model,
            "messages": messages,
            "temperature": temp,
            "max_tokens": predict,
            "stream": True
        }
        resp = self.session.post(f"{self.base_url}/v1/chat/completions", json=payload, headers=headers, stream=True, timeout=45.0)
        if resp.status_code != 200:
            raise RuntimeError(f"LLM streaming failed ({resp.status_code}): {resp.text}")
        for line in resp.iter_lines():
            line_str = line.decode('utf-8') if isinstance(line, bytes) else line
            if line_str.startswith("data: ") and line_str != "data: [DONE]":
                try:
                    chunk = json.loads(line_str[6:])
                    delta = chunk["choices"][0].get("delta", {}).get("content", "")
                    if delta:
                        yield delta
                except Exception:
                    pass
