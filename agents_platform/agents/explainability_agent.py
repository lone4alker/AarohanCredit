"""
Guidance/Explainability Agent - Provides human-readable explanations and recommendations using LangChain + Gemini.
"""

from typing import Dict, Any, Optional
from datetime import datetime
import json

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import Runnable

from ..core.base_agent import BaseAgent
from ..core.types import AgentOutput, ExplainabilityReport
from ..core.llm import get_gemini_llm


class ExplainabilityAgent(BaseAgent):
    """
    Agent responsible for:
    - Explaining the scores in human language using Gemini
    - Providing MSME improvement recommendations
    - Providing lender-facing arguments for compliance
    """

    def __init__(self):
        super().__init__(
            name="ExplainabilityAgent",
            description="Gemini-powered explainability and guidance agent"
        )
        self._parser = JsonOutputParser(pydantic_object=ExplainabilityReport)
        self._chain = self._build_chain()

    def _build_chain(self) -> Runnable:
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    (
                        "You are a bilingual credit coach who explains MSME credit decisions transparently. "
                        "Use the structured facts to craft borrower guidance, lender arguments, strengths, weaknesses, "
                        "and actionable recommendations. Respond strictly in JSON following the schema."
                    ),
                ),
                (
                    "human",
                    (
                        "Financial health summary:\n{financial_health_json}\n\n"
                        "Behavioral score summary:\n{behavioral_score_json}\n\n"
                        "Product recommendation summary:\n{product_recommendations_json}\n\n"
                        "Derived facts and heuristics:\n{derived_facts_json}\n\n"
                        "{format_instructions}"
                    ),
                ),
            ]
        )
        llm = get_gemini_llm()
        return prompt | llm | self._parser

    def run(self, input_data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> AgentOutput:
        """
        Generate explainability report via LangChain + Gemini.
        """
        try:
            self.log_step("Starting explainability analysis (LangChain + Gemini)")

            financial_health = input_data.get("financial_health", {})
            behavioral_score = input_data.get("behavioral_score", {})
            product_recommendations = input_data.get("product_recommendations", {})

            derived_facts = self._derive_facts(financial_health, behavioral_score)

            payload = {
                "financial_health_json": json.dumps(financial_health, default=str, indent=2),
                "behavioral_score_json": json.dumps(behavioral_score, default=str, indent=2),
                "product_recommendations_json": json.dumps(product_recommendations, default=str, indent=2),
                "derived_facts_json": json.dumps(derived_facts, default=str, indent=2),
                "format_instructions": self._parser.get_format_instructions(),
            }

            self.log_step("Invoking Gemini for explainability synthesis")
            result = self._chain.invoke(payload)  # could be dict or Pydantic model

            # Normalize to ExplainabilityReport model when possible
            rep_model = None
            try:
                if hasattr(result, "model_dump"):
                    try:
                        result.metadata = {
                            "generated_at": datetime.now().isoformat(),
                            "engine": "LangChain-Gemini",
                        }
                        rep_model = result
                    except Exception:
                        rep_model = result.model_copy(update={
                            "metadata": {
                                "generated_at": datetime.now().isoformat(),
                                "engine": "LangChain-Gemini",
                            }
                        })
                elif isinstance(result, dict):
                    try:
                        rep_model = ExplainabilityReport(**result)
                        rep_model = rep_model.model_copy(update={
                            "metadata": {
                                "generated_at": datetime.now().isoformat(),
                                "engine": "LangChain-Gemini",
                            }
                        })
                    except Exception:
                        rep_model = None
            except Exception as e:
                self.logger.exception("Failed to normalize explainability result: %s", e)
                rep_model = None

            if rep_model is None:
                self.logger.warning("LLM returned unexpected explainability format; falling back to deterministic explainability")
                # Build deterministic minimal explainability report
                rep_model = ExplainabilityReport(
                    score_explanations={},
                    improvement_recommendations=[],
                    lender_arguments={},
                    key_insights=[],
                    risk_factors=[],
                    strengths=[],
                    weaknesses=[],
                    metadata={"fallback": True, "generated_at": datetime.now().isoformat()},
                )

            self.log_step("Explainability analysis completed successfully")

            return self.create_output(
                success=True,
                data=rep_model.model_dump(),
                metadata={
                    "agent": self.name,
                    "timestamp": datetime.now().isoformat(),
                },
            )

        except Exception as exc:
            self.logger.error("Error in explainability analysis", exc_info=True)
            return self.create_output(
                success=False,
                data={},
                errors=[f"Explainability analysis failed: {exc}"],
            )

    def _derive_facts(self, financial_health: Dict[str, Any], behavioral_score: Dict[str, Any]) -> Dict[str, Any]:
        """Create deterministic facts/heuristics that guide the LLM output."""
        net_cf = financial_health.get("net_cashflow", 0)
        stability = financial_health.get("cashflow_stability_score", 0)
        volatility = financial_health.get("volatility_score", 0)
        red_flags = behavioral_score.get("red_flags", [])
        behavioral_value = behavioral_score.get("behavioral_score", 0)

        strengths = []
        weaknesses = []

        if net_cf > 0:
            strengths.append(f"Positive net cashflow of ₹{net_cf:,.2f}")
        else:
            weaknesses.append(f"Negative net cashflow of ₹{abs(net_cf):,.2f}")

        if stability >= 0.7:
            strengths.append("High cashflow stability")
        elif stability < 0.4:
            weaknesses.append("Low cashflow stability")

        if volatility <= 0.3:
            strengths.append("Low cashflow volatility")
        elif volatility > 0.7:
            weaknesses.append("High cashflow volatility")

        if behavioral_value >= 650:
            strengths.append(f"Strong behavioral score {behavioral_value:.0f}/1000")
        elif behavioral_value < 450:
            weaknesses.append(f"Weak behavioral score {behavioral_value:.0f}/1000")

        if not red_flags:
            strengths.append("No lending red flags detected")
        else:
            weaknesses.append(f"{len(red_flags)} red flags detected: {', '.join(red_flags[:3])}")

        return {
            "net_cashflow": net_cf,
            "stability_score": stability,
            "volatility_score": volatility,
            "behavioral_score": behavioral_value,
            "red_flags": red_flags,
            "strength_candidates": strengths,
            "weakness_candidates": weaknesses,
        }

