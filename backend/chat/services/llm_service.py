"""
Ollama LLM Generation Service for Saki & Akku Relationship Assistant.
Integrates with local Ollama server running Qwen 2.5 Instruct.
Supports streaming SSE and non-streaming generation, timeout handling, and keep-alive.
"""

import json
import logging
import requests
from typing import List, Dict, Any, Generator, Optional
from django.conf import settings

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(
        self,
        base_url: Optional[str] = None,
        model_name: Optional[str] = None,
        temperature: Optional[float] = None,
        num_ctx: Optional[int] = None,
        max_tokens: Optional[int] = None,
        keep_alive: Optional[str] = None
    ):
        self.base_url = (base_url or getattr(settings, 'OLLAMA_BASE_URL', 'http://localhost:11434')).rstrip('/')
        self.model_name = model_name or getattr(settings, 'OLLAMA_MODEL', 'qwen2.5:3b')
        self.temperature = temperature if temperature is not None else getattr(settings, 'OLLAMA_TEMPERATURE', 0.4)
        self.top_p = getattr(settings, 'OLLAMA_TOP_P', 0.9)
        self.repeat_penalty = getattr(settings, 'OLLAMA_REPEAT_PENALTY', 1.15)
        self.num_ctx = num_ctx or getattr(settings, 'OLLAMA_NUM_CTX', 4096)
        self.max_tokens = max_tokens or getattr(settings, 'OLLAMA_MAX_TOKENS', 512)
        self.keep_alive = keep_alive or getattr(settings, 'OLLAMA_KEEP_ALIVE', '5m')
        self.session = requests.Session()

    def is_available(self) -> bool:
        """Checks if Ollama server is running and accessible."""
        try:
            resp = self.session.get(f"{self.base_url}/api/tags", timeout=2.0)
            return resp.status_code == 200
        except Exception:
            return False

    def list_models(self) -> List[str]:
        """Returns list of downloaded Ollama models."""
        try:
            resp = self.session.get(f"{self.base_url}/api/tags", timeout=3.0)
            if resp.status_code == 200:
                data = resp.json()
                return [m.get("name") for m in data.get("models", [])]
        except Exception as e:
            logger.warning(f"Could not fetch Ollama models: {e}")
        return []

    def generate(self, messages: List[Dict[str, str]]) -> str:
        """
        Synchronously generates complete response from Ollama /api/chat.
        """
        payload = {
            "model": self.model_name,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": self.temperature,
                "top_p": self.top_p,
                "repeat_penalty": self.repeat_penalty,
                "repeat_last_n": 64,
                "num_ctx": self.num_ctx,
                "num_predict": self.max_tokens
            },
            "keep_alive": self.keep_alive
        }

        try:
            resp = self.session.post(
                f"{self.base_url}/api/chat",
                json=payload,
                timeout=90.0
            )
            if resp.status_code != 200:
                error_msg = f"Ollama returned HTTP {resp.status_code}: {resp.text}"
                logger.error(error_msg)
                raise RuntimeError(error_msg)

            data = resp.json()
            message = data.get("message", {})
            return message.get("content", "").strip()

        except requests.exceptions.ConnectionError as ce:
            logger.error(f"Cannot connect to Ollama at {self.base_url}: {ce}")
            raise RuntimeError(
                f"Ollama is not running at {self.base_url}. Please ensure Ollama is started."
            ) from ce
        except Exception as e:
            logger.error(f"Error during LLM generation: {e}")
            raise

    def generate_stream(self, messages: List[Dict[str, str]]) -> Generator[str, None, None]:
        """
        Streams response tokens incrementally from Ollama /api/chat.
        Yields token strings.
        """
        payload = {
            "model": self.model_name,
            "messages": messages,
            "stream": True,
            "options": {
                "temperature": self.temperature,
                "top_p": self.top_p,
                "repeat_penalty": self.repeat_penalty,
                "repeat_last_n": 64,
                "num_ctx": self.num_ctx,
                "num_predict": self.max_tokens
            },
            "keep_alive": self.keep_alive
        }

        try:
            with self.session.post(
                f"{self.base_url}/api/chat",
                json=payload,
                stream=True,
                timeout=(5.0, 90.0)
            ) as response:
                if response.status_code != 200:
                    yield f"Error: Ollama server returned status {response.status_code}"
                    return

                for line in response.iter_lines():
                    if line:
                        chunk = json.loads(line.decode("utf-8"))
                        msg = chunk.get("message", {})
                        content = msg.get("content", "")
                        if content:
                            yield content
                        if chunk.get("done", False):
                            break
        except requests.exceptions.ConnectionError:
            yield "Error: Could not connect to local Ollama. Please verify that Ollama is running."
        except Exception as e:
            logger.error(f"Streaming error from Ollama: {e}")
            yield f"\n[Generation error: {str(e)}]"
