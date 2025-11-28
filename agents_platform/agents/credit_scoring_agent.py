"""
Credit Scoring Agent - Builds behavioral alternative credit scores using LangChain + Gemini.
"""

from typing import Dict, Any, Optional
from datetime import datetime
import json

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import Runnable

from ..core.base_agent import BaseAgent
from ..core.types import AgentOutput, BehavioralScore
from ..tools.data_parser import extract_transactions_from_json
from ..tools.financial_calculator import compute_cashflow_metrics, compute_stability_score
from ..tools.anomaly_detector import detect_anomalies, detect_red_flags
from ..core.llm import get_gemini_llm


class CreditScoringAgent(BaseAgent):
    """
    Agent responsible for:
    - Building behavioral alternative credit scores with Gemini
    - Detecting repayment patterns and anomalies (tool outputs)
    - Producing LangChain-native reasoning pipelines
    """

    def __init__(self):
        super().__init__(
            name="CreditScoringAgent",
            description="Gemini-powered behavioral credit scoring agent"
        )
        self._parser = JsonOutputParser(pydantic_object=BehavioralScore)
        self._chain = self._build_chain()

    def _build_chain(self) -> Runnable:
        """Create the LangChain runnable pipeline."""
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    (
                        "You are a senior credit risk analyst for MSME lending. "
                        "Use the structured metrics provided to produce a behavioral credit score.\n"
                        "Respond using the JSON schema below. Be precise and justify anomalies/red flags."
                    ),
                ),
                (
                    "human",
                    (
                        "Financial health snapshot:\n{financial_health_json}\n\n"
                        "Behavioral metrics extracted from raw transactions:\n{metrics_json}\n\n"
                        "{format_instructions}"
                    ),
                ),
            ]
        )
        llm = get_gemini_llm()
        return prompt | llm | self._parser

    def run(self, input_data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> AgentOutput:
        """
        Analyze transactions and financial health to compute behavioral credit score
        via LangChain + Gemini.
        """
        try:
            self.log_step("Starting credit scoring analysis (LangChain + Gemini)")

            # Extract transactions (handles both old and new formats)
            transactions = self._extract_transactions(input_data)
            financial_health = input_data.get("financial_health", {})

            if not transactions and not financial_health:
                return self.create_output(
                    success=False,
                    data={},
                    errors=["No transaction or financial health data provided"],
                )

            metrics_snapshot = self._summarize_behavioral_metrics(transactions, financial_health)

            llm_payload = {
                "financial_health_json": json.dumps(financial_health, default=str, indent=2),
                "metrics_json": json.dumps(metrics_snapshot, default=str, indent=2),
                "format_instructions": self._parser.get_format_instructions(),
            }

            self.log_step("Invoking Gemini behavioral scoring chain")
            result = self._chain.invoke(llm_payload)  # could be dict or Pydantic model

            self.log_step("Credit scoring analysis completed successfully")

            # Normalize result to a dict for AgentOutput. Try to coerce to BehavioralScore model when possible.
            data: Dict[str, Any]
            try:
                # If it's already a Pydantic model with model_dump
                if hasattr(result, "model_dump"):
                    data = result.model_dump()
                elif isinstance(result, dict):
                    # Attempt to validate/normalize via BehavioralScore
                    try:
                        validated = BehavioralScore(**result)
                        data = validated.model_dump()
                    except Exception:
                        data = result
                else:
                    # Last resort: try to convert to dict
                    try:
                        data = dict(result)
                    except Exception:
                        data = {"raw_result": str(result)}
            except Exception as e:
                self.logger.exception("Failed to normalize LLM result: %s", e)
                data = {"raw_result": str(result)}

            return self.create_output(
                success=True,
                data=data,
                metadata={
                    "agent": self.name,
                    "timestamp": datetime.now().isoformat(),
                    "engine": "LangChain-Gemini",
                },
            )

        except Exception as exc:
            self.logger.error("Error in credit scoring agent", exc_info=True)
            return self.create_output(
                success=False,
                data={},
                errors=[f"Credit scoring failed: {exc}"],
            )

    def _summarize_behavioral_metrics(self, transactions: list, financial_health: Dict[str, Any]) -> Dict[str, Any]:
        """Aggregate tool-based insights that the LLM will reason over."""
        cashflow_metrics = compute_cashflow_metrics(transactions) if transactions else {}
        stability_score = compute_stability_score(transactions) if transactions else 0
        anomalies = detect_anomalies(transactions)[:5] if transactions else []
        red_flags = detect_red_flags(transactions, financial_health)

        emi_count = sum(
            1
            for tx in transactions
            if "emi" in str(tx.get("description", "")).lower() or "loan" in str(tx.get("description", "")).lower()
        )

        return {
            "transaction_count": len(transactions),
            "cashflow_metrics": cashflow_metrics,
            "stability_score": stability_score,
            "anomalies_detected": anomalies,
            "red_flags_detected": red_flags,
            "emi_payments_detected": emi_count,
        }
    
    def _extract_transactions(self, input_data: Dict[str, Any]) -> list:
        """
        Extract transactions from input data.
        Handles both old format (transactions at root) and new format (transactions in bank_accounts).
        
        Args:
            input_data: Input data dictionary
            
        Returns:
            List of transaction dictionaries
        """
        # If transactions are already at root level (old format or already extracted)
        if 'transactions' in input_data and isinstance(input_data['transactions'], list):
            return input_data['transactions']
        
        # If input_data has a file_path key
        if 'file_path' in input_data:
            from ..tools.data_parser import parse_json_data
            data = parse_json_data(input_data['file_path'])
            return extract_transactions_from_json(data)
        
        # Try to extract from JSON structure (new format with bank_accounts)
        try:
            return extract_transactions_from_json(input_data)
        except Exception as e:
            self.logger.warning(f"Failed to extract transactions: {e}")
            return []

