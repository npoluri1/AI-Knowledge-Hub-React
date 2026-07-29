"""Multi-LLM service supporting OpenAI, Anthropic, Google, and Ollama."""
import httpx
from typing import AsyncGenerator, Optional
from app.core.config import settings
import structlog

logger = structlog.get_logger()


class LLMService:
    """Unified interface for multiple LLM providers."""

    def __init__(self):
        self.providers = {
            "openai": self._openai_generate,
            "anthropic": self._anthropic_generate,
            "google": self._google_generate,
            "ollama": self._ollama_generate,
        }
        self.stream_providers = {
            "openai": self._openai_stream,
            "anthropic": self._anthropic_stream,
            "google": self._google_stream,
            "ollama": self._ollama_stream,
        }

    async def generate(
        self,
        prompt: str,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        system_prompt: str = "You are a helpful assistant.",
        provider: Optional[str] = None,
    ) -> dict:
        """Generate a response from the specified LLM provider."""
        provider = provider or settings.llm_provider.value
        model = model or self._get_default_model(provider)
        temperature = temperature or settings.temperature

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ]

        try:
            result = await self.providers[provider](
                messages=messages,
                model=model,
                temperature=temperature,
            )
            return result
        except Exception as e:
            logger.error("LLM generation error", provider=provider, error=str(e))
            raise

    async def generate_stream(
        self,
        prompt: str,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        system_prompt: str = "You are a helpful assistant.",
        provider: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        """Stream a response from the specified LLM provider."""
        provider = provider or settings.llm_provider.value
        model = model or self._get_default_model(provider)
        temperature = temperature or settings.temperature

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ]

        try:
            async for chunk in self.stream_providers[provider](
                messages=messages,
                model=model,
                temperature=temperature,
            ):
                yield chunk
        except Exception as e:
            logger.error("LLM stream error", provider=provider, error=str(e))
            raise

    def _get_default_model(self, provider: str) -> str:
        """Get default model for provider."""
        defaults = {
            "openai": settings.openai_model,
            "anthropic": settings.anthropic_model,
            "google": settings.google_model,
            "ollama": settings.ollama_model,
        }
        return defaults.get(provider, settings.ollama_model)

    # --- OpenAI ---
    async def _openai_generate(self, messages, model, temperature) -> dict:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.openai_api_key}"},
                json={
                    "model": model,
                    "messages": messages,
                    "temperature": temperature,
                },
                timeout=60.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "response": data["choices"][0]["message"]["content"],
                "model": model,
                "tokens_used": data.get("usage", {}).get("total_tokens", 0),
                "provider": "openai",
            }

    async def _openai_stream(self, messages, model, temperature) -> AsyncGenerator[str, None]:
        async with httpx.AsyncClient() as client:
            async with client.stream(
                "POST",
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.openai_api_key}"},
                json={
                    "model": model,
                    "messages": messages,
                    "temperature": temperature,
                    "stream": True,
                },
                timeout=60.0,
            ) as resp:
                async for line in resp.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]
                        if data == "[DONE]":
                            break
                        import json
                        chunk = json.loads(data)
                        delta = chunk["choices"][0].get("delta", {})
                        if "content" in delta:
                            yield delta["content"]

    # --- Anthropic ---
    async def _anthropic_generate(self, messages, model, temperature) -> dict:
        system_msg = messages[0]["content"] if messages[0]["role"] == "system" else ""
        user_msgs = [m for m in messages if m["role"] != "system"]

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": settings.anthropic_api_key,
                    "anthropic-version": "2023-06-01",
                },
                json={
                    "model": model,
                    "max_tokens": settings.max_tokens,
                    "system": system_msg,
                    "messages": user_msgs,
                    "temperature": temperature,
                },
                timeout=60.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "response": data["content"][0]["text"],
                "model": model,
                "tokens_used": data.get("usage", {}).get("input_tokens", 0)
                + data.get("usage", {}).get("output_tokens", 0),
                "provider": "anthropic",
            }

    async def _anthropic_stream(self, messages, model, temperature) -> AsyncGenerator[str, None]:
        system_msg = messages[0]["content"] if messages[0]["role"] == "system" else ""
        user_msgs = [m for m in messages if m["role"] != "system"]

        async with httpx.AsyncClient() as client:
            async with client.stream(
                "POST",
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": settings.anthropic_api_key,
                    "anthropic-version": "2023-06-01",
                },
                json={
                    "model": model,
                    "max_tokens": settings.max_tokens,
                    "system": system_msg,
                    "messages": user_msgs,
                    "temperature": temperature,
                    "stream": True,
                },
                timeout=60.0,
            ) as resp:
                async for line in resp.aiter_lines():
                    if line.startswith("data: "):
                        import json
                        chunk = json.loads(line[6:])
                        if chunk.get("type") == "content_block_delta":
                            yield chunk["delta"].get("text", "")

    # --- Google ---
    async def _google_generate(self, messages, model, temperature) -> dict:
        import google.generativeai as genai
        genai.configure(api_key=settings.google_api_key)
        model_instance = genai.GenerativeModel(model)
        contents = [m["content"] for m in messages if m["role"] != "system"]
        response = await model_instance.generate_content_async(
            contents,
            generation_config=genai.GenerationConfig(temperature=temperature),
        )
        return {
            "response": response.text,
            "model": model,
            "tokens_used": response.usage_metadata.total_token_count if hasattr(response, 'usage_metadata') else 0,
            "provider": "google",
        }

    async def _google_stream(self, messages, model, temperature) -> AsyncGenerator[str, None]:
        import google.generativeai as genai
        genai.configure(api_key=settings.google_api_key)
        model_instance = genai.GenerativeModel(model)
        contents = [m["content"] for m in messages if m["role"] != "system"]
        response = await model_instance.generate_content_async(
            contents,
            generation_config=genai.GenerationConfig(temperature=temperature),
            stream=True,
        )
        async for chunk in response:
            if chunk.text:
                yield chunk.text

    # --- Ollama ---
    async def _ollama_generate(self, messages, model, temperature) -> dict:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{settings.ollama_base_url}/api/chat",
                json={
                    "model": model,
                    "messages": messages,
                    "stream": False,
                    "options": {"temperature": temperature},
                },
                timeout=120.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "response": data["message"]["content"],
                "model": model,
                "tokens_used": data.get("eval_count", 0),
                "provider": "ollama",
            }

    async def _ollama_stream(self, messages, model, temperature) -> AsyncGenerator[str, None]:
        async with httpx.AsyncClient() as client:
            async with client.stream(
                "POST",
                f"{settings.ollama_base_url}/api/chat",
                json={
                    "model": model,
                    "messages": messages,
                    "stream": True,
                    "options": {"temperature": temperature},
                },
                timeout=120.0,
            ) as resp:
                import json
                async for line in resp.aiter_lines():
                    if line:
                        chunk = json.loads(line)
                        if "message" in chunk:
                            yield chunk["message"].get("content", "")
