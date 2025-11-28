"""
LangChain LLM factory helpers for Gemini models.
"""

from functools import lru_cache
from typing import Optional

from langchain_google_genai import ChatGoogleGenerativeAI

from .config import settings


@lru_cache(maxsize=4)
def get_gemini_llm(model: Optional[str] = None, temperature: Optional[float] = None) -> ChatGoogleGenerativeAI:
    """
    Return a cached LangChain ChatGoogleGenerativeAI instance.

    Args:
        model: Optional override for the Gemini model name
        temperature: Optional override for temperature

    Raises:
        ValueError: If the Gemini API key is not configured
    """

    if not settings.GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY is not set. Please configure it in the environment to use Gemini-powered agents."
        )

    return ChatGoogleGenerativeAI(
        model=model or settings.GEMINI_MODEL,
        api_key=settings.GEMINI_API_KEY,
        temperature=temperature if temperature is not None else settings.LLM_TEMPERATURE,
        convert_system_message_to_human=True,
    )

