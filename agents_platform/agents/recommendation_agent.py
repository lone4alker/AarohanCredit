"""
Recommendation Agent (xAI) - Provides user recommendations to improve their profile based on collected data.
"""

from typing import Dict, Any, Optional
from datetime import datetime
import json

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import Runnable

from ..core.base_agent import BaseAgent
from ..core.types import AgentOutput, RecommendationReport
from ..core.llm import get_gemini_llm


class RecommendationAgent(BaseAgent):
    """
    Agent responsible for:
    - Analyzing all collected financial data
    - Providing actionable recommendations to improve credit profile
    - Suggesting cashflow optimization strategies
    - Recommending GST compliance improvements
    - Providing credit score enhancement tips
    - Identifying risk mitigation strategies
    """

    def __init__(self):
        super().__init__(
            name="RecommendationAgent",
            description="Gemini-powered recommendation agent for profile improvement"
        )
        self._parser = JsonOutputParser(pydantic_object=RecommendationReport)
        self._chain = self._build_chain()

    def _build_chain(self) -> Runnable:
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    (
                        "You are an expert financial advisor specializing in MSME credit profile improvement. "
                        "Analyze the provided financial data and generate actionable, specific recommendations "
                        "to help the MSME improve their credit profile, cashflow, GST compliance, and overall "
                        "creditworthiness. Focus on practical, implementable suggestions. "
                        "Respond strictly in JSON following the schema."
                    ),
                ),
                (
                    "human",
                    (
                        "MSME Profile:\n{msme_profile_json}\n\n"
                        "Financial Health Summary:\n{financial_health_json}\n\n"
                        "Health Analysis:\n{health_analysis_json}\n\n"
                        "Behavioral Score:\n{behavioral_score_json}\n\n"
                        "GST Analysis:\n{gst_analysis_json}\n\n"
                        "Product Recommendations:\n{product_recommendations_json}\n\n"
                        "Provide specific, actionable recommendations to improve this MSME's credit profile. "
                        "Categorize recommendations into quick wins (easy to implement) and long-term strategies. "
                        "Focus on cashflow optimization, GST compliance, credit score enhancement, and risk mitigation.\n\n"
                        "{format_instructions}"
                    ),
                ),
            ]
        )
        llm = get_gemini_llm()
        return prompt | llm | self._parser

    def run(self, input_data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> AgentOutput:
        """
        Generate recommendation report via LangChain + Gemini.
        """
        try:
            self.log_step("Starting recommendation analysis (LangChain + Gemini)")

            msme_profile = input_data.get("msme_profile", {})
            financial_health = input_data.get("financial_health", {})
            health_analysis = input_data.get("health_analysis", {})
            behavioral_score = input_data.get("behavioral_score", {})
            product_recommendations = input_data.get("product_recommendations", {})

            # Extract GST analysis from health_analysis if available
            gst_analysis = health_analysis.get("gst_analysis", {}) if health_analysis else {}

            payload = {
                "msme_profile_json": json.dumps(msme_profile, default=str, indent=2),
                "financial_health_json": json.dumps(financial_health, default=str, indent=2),
                "health_analysis_json": json.dumps(health_analysis, default=str, indent=2),
                "behavioral_score_json": json.dumps(behavioral_score, default=str, indent=2),
                "gst_analysis_json": json.dumps(gst_analysis, default=str, indent=2),
                "product_recommendations_json": json.dumps(product_recommendations, default=str, indent=2),
                "format_instructions": self._parser.get_format_instructions(),
            }

            self.log_step("Invoking Gemini for recommendation synthesis")
            result = self._chain.invoke(payload)

            # Normalize to RecommendationReport model
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
                        rep_model = RecommendationReport(**result)
                        rep_model = rep_model.model_copy(update={
                            "metadata": {
                                "generated_at": datetime.now().isoformat(),
                                "engine": "LangChain-Gemini",
                            }
                        })
                    except Exception:
                        rep_model = None
            except Exception as e:
                self.logger.exception("Failed to normalize recommendation result: %s", e)
                rep_model = None

            if rep_model is None:
                self.logger.warning("LLM returned unexpected recommendation format; falling back to deterministic recommendations")
                # Build deterministic minimal recommendation report
                rep_model = self._generate_deterministic_recommendations(
                    financial_health, health_analysis, behavioral_score, gst_analysis
                )

            self.log_step("Recommendation analysis completed successfully")

            return self.create_output(
                success=True,
                data=rep_model.model_dump(),
                metadata={
                    "agent": self.name,
                    "timestamp": datetime.now().isoformat(),
                },
            )

        except Exception as exc:
            self.logger.error("Error in recommendation analysis", exc_info=True)
            return self.create_output(
                success=False,
                data={},
                errors=[f"Recommendation analysis failed: {exc}"],
            )

    def _generate_deterministic_recommendations(
        self,
        financial_health: Dict[str, Any],
        health_analysis: Dict[str, Any],
        behavioral_score: Dict[str, Any],
        gst_analysis: Dict[str, Any]
    ) -> RecommendationReport:
        """Generate deterministic recommendations based on heuristics."""
        recommendations = []
        cashflow_optimization = []
        gst_compliance_improvements = []
        credit_score_enhancement = []
        risk_mitigation = []
        quick_wins = []
        long_term_strategies = []

        # Analyze cashflow
        net_cf = health_analysis.get("net_cashflow", financial_health.get("net_cashflow", 0))
        volatility = health_analysis.get("cashflow_volatility", financial_health.get("volatility_score", 0))
        low_balance_days = health_analysis.get("low_balance_days", 0)
        overdraft_days = health_analysis.get("overdraft_days", 0)

        if net_cf < 0:
            cashflow_optimization.append("Focus on increasing revenue streams or reducing operational expenses")
            quick_wins.append("Review and negotiate better payment terms with suppliers")
            recommendations.append({
                "priority": "high",
                "category": "cashflow",
                "action": "Address negative cashflow by improving collection cycles"
            })

        if volatility > 0.5:
            cashflow_optimization.append("Diversify revenue sources to reduce cashflow volatility")
            long_term_strategies.append("Build cash reserves during high-revenue months")

        if low_balance_days > 10:
            risk_mitigation.append(f"Maintain higher minimum balance (currently {low_balance_days} days below threshold)")
            quick_wins.append("Set up automatic balance alerts")

        if overdraft_days > 0:
            risk_mitigation.append(f"Eliminate overdraft usage (currently {overdraft_days} days with negative balance)")
            credit_score_enhancement.append("Avoid negative balances to improve credit profile")

        # Analyze GST compliance
        gst_compliance_rate = gst_analysis.get("compliance_rate", 100)
        if gst_compliance_rate < 100:
            gst_compliance_improvements.append(f"Ensure 100% GST filing compliance (currently {gst_compliance_rate:.1f}%)")
            quick_wins.append("Set up reminders for GST filing deadlines")

        # Analyze behavioral score
        b_score = behavioral_score.get("behavioral_score", 0)
        if b_score < 600:
            credit_score_enhancement.append("Improve repayment consistency to boost behavioral score")
            long_term_strategies.append("Build credit history through regular, timely payments")

        # EMI analysis
        emi_count = health_analysis.get("emi_transactions", 0)
        if emi_count == 0:
            credit_score_enhancement.append("Consider taking small credit facilities to build credit history")

        # Cheque bounces
        bounces = health_analysis.get("cheque_bounces", 0)
        if bounces > 0:
            risk_mitigation.append(f"Eliminate cheque bounces (currently {bounces} instances)")
            quick_wins.append("Switch to digital payment methods to avoid bounce charges")

        return RecommendationReport(
            profile_improvement_recommendations=recommendations,
            cashflow_optimization=cashflow_optimization,
            gst_compliance_improvements=gst_compliance_improvements,
            credit_score_enhancement=credit_score_enhancement,
            risk_mitigation=risk_mitigation,
            quick_wins=quick_wins,
            long_term_strategies=long_term_strategies,
            metadata={
                "fallback": True,
                "generated_at": datetime.now().isoformat()
            }
        )
