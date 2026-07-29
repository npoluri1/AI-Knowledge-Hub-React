"""LLM Factory for multi-provider abstraction."""
from typing import Optional
from app.core.config import settings
import structlog

logger = structlog.get_logger()


class LLMFactory:
    """Factory pattern for creating LLM clients."""

    _providers = {}

    @classmethod
    def register(cls, name: str, provider_class):
        """Register a new LLM provider."""
        cls._providers[name] = provider_class

    @classmethod
    def create(cls, provider: Optional[str] = None, **kwargs):
        """Create an LLM client for the specified provider."""
        provider = provider or settings.llm_provider.value

        if provider not in cls._providers:
            # Auto-register built-in providers
            cls._register_builtins()

        if provider not in cls._providers:
            raise ValueError(f"Unknown provider: {provider}. Available: {list(cls._providers.keys())}")

        return cls._providers[provider](**kwargs)

    @classmethod
    def _register_builtins(cls):
        """Register built-in providers."""
        cls.register("openai", OpenAIProvider)
        cls.register("anthropic", AnthropicProvider)
        cls.register("google", GoogleProvider)
        cls.register("ollama", OllamaProvider)
        cls.register("groq", GroqProvider)
        cls.register("together", TogetherProvider)


class BaseProvider:
    """Base LLM provider class."""

    def __init__(self, **kwargs):
        self.config = kwargs

    async def generate(self, messages: list[dict], **kwargs) -> dict:
        raise NotImplementedError

    async def generate_stream(self, messages: list[dict], **kwargs):
        raise NotImplementedError


class OpenAIProvider(BaseProvider):
    """OpenAI LLM provider."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.api_key = kwargs.get("api_key") or settings.openai_api_key

    async def generate(self, messages, **kwargs) -> dict:
        import httpx
        model = kwargs.get("model", settings.openai_model)

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"model": model, "messages": messages, "temperature": kwargs.get("temperature", 0.1)},
                timeout=60.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "response": data["choices"][0]["message"]["content"],
                "model": model,
                "tokens_used": data.get("usage", {}).get("total_tokens", 0),
            }


class AnthropicProvider(BaseProvider):
    """Anthropic LLM provider."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.api_key = kwargs.get("api_key") or settings.anthropic_api_key

    async def generate(self, messages, **kwargs) -> dict:
        import httpx
        model = kwargs.get("model", settings.anthropic_model)

        system_msg = messages[0]["content"] if messages[0]["role"] == "system" else ""
        user_msgs = [m for m in messages if m["role"] != "system"]

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={"x-api-key": self.api_key, "anthropic-version": "2023-06-01"},
                json={"model": model, "max_tokens": 4096, "system": system_msg, "messages": user_msgs},
                timeout=60.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "response": data["content"][0]["text"],
                "model": model,
                "tokens_used": data.get("usage", {}).get("input_tokens", 0) + data.get("usage", {}).get("output_tokens", 0),
            }


class GoogleProvider(BaseProvider):
    """Google Gemini LLM provider."""

    async def generate(self, messages, **kwargs) -> dict:
        import google.generativeai as genai
        model = kwargs.get("model", settings.google_model)
        genai.configure(api_key=settings.google_api_key)
        model_instance = genai.GenerativeModel(model)
        contents = [m["content"] for m in messages if m["role"] != "system"]
        response = await model_instance.generate_content_async(contents)
        return {"response": response.text, "model": model, "tokens_used": 0}


class OllamaProvider(BaseProvider):
    """Ollama (local) LLM provider."""

    async def generate(self, messages, **kwargs) -> dict:
        import httpx
        model = kwargs.get("model", settings.ollama_model)

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{settings.ollama_base_url}/api/chat",
                json={"model": model, "messages": messages, "stream": False},
                timeout=120.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "response": data["message"]["content"],
                "model": model,
                "tokens_used": data.get("eval_count", 0),
            }


class GroqProvider(BaseProvider):
    """Groq LLM provider (fast inference)."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.api_key = kwargs.get("api_key")

    async def generate(self, messages, **kwargs) -> dict:
        import httpx
        model = kwargs.get("model", "llama-3.1-70b-versatile")

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"model": model, "messages": messages, "temperature": kwargs.get("temperature", 0.1)},
                timeout=60.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "response": data["choices"][0]["message"]["content"],
                "model": model,
                "tokens_used": data.get("usage", {}).get("total_tokens", 0),
            }


class TogetherProvider(BaseProvider):
    """Together AI LLM provider."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.api_key = kwargs.get("api_key")

    async def generate(self, messages, **kwargs) -> dict:
        import httpx
        model = kwargs.get("model", "meta-llama/Llama-3-70b-chat-hf")

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.together.xyz/v1/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"model": model, "messages": messages, "temperature": kwargs.get("temperature", 0.1)},
                timeout=60.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "response": data["choices"][0]["message"]["content"],
                "model": model,
                "tokens_used": data.get("usage", {}).get("total_tokens", 0),
            }
