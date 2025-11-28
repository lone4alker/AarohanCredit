"""
Policy Matching Agent - Matches MSME profile to lender product eligibility via LangChain + Gemini.
"""

from typing import Dict, Any, Optional, List
from datetime import datetime
import json
import os

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import Runnable

from ..core.base_agent import BaseAgent
from ..core.types import AgentOutput, ProductRecommendation, ProductEligibility
from ..core.config import settings
from ..core.llm import get_gemini_llm


class PolicyMatchingAgent(BaseAgent):
    """
    Agent responsible for:
    - Matching MSME profile to product eligibility
    - Determining best-fit products and risk buckets using Gemini
    - Producing LangChain-native recommendations for the frontend
    """

    def __init__(self):
        super().__init__(
            name="PolicyMatchingAgent",
            description="Gemini-powered lender policy matching agent"
        )
        self.policies = self._load_policies()
        self._parser = JsonOutputParser(pydantic_object=ProductRecommendation)
        self._chain = self._build_chain()

    def _build_chain(self) -> Runnable:
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    (
                        "You are a senior credit policy expert helping MSMEs choose the best loan products. "
                        "Use the structured evaluation data to recommend best-fit and alternative products. "
                        "Respond strictly as JSON following the provided schema."
                    ),
                ),
                (
                    "human",
                    (
                        "MSME profile:\n{msme_profile_json}\n\n"
                        "Financial health summary:\n{financial_health_json}\n\n"
                        "Behavioral score summary:\n{behavioral_score_json}\n\n"
                        "Deterministic policy evaluations:\n{policy_scores_json}\n\n"
                        "{format_instructions}"
                    ),
                ),
            ]
        )
        llm = get_gemini_llm()
        return prompt | llm | self._parser

    def run(self, input_data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> AgentOutput:
        """
        Match MSME profile to available products.
        """
        try:
            self.log_step("Starting policy matching (LangChain + Gemini)")

            financial_health = input_data.get("financial_health", {})
            behavioral_score = input_data.get("behavioral_score", {})
            msme_profile = input_data.get("msme_profile", {})

            if not self.policies:
                return self.create_output(
                    success=False,
                    data={},
                    errors=["No lender policies available"],
                )

            evaluations = []
            for product in self.policies:
                evaluation = self._evaluate_product(
                    product,
                    financial_health,
                    behavioral_score,
                    msme_profile,
                )
                if evaluation:
                    evaluations.append(evaluation)

            payload = {
                "msme_profile_json": json.dumps(msme_profile, default=str, indent=2),
                "financial_health_json": json.dumps(financial_health, default=str, indent=2),
                "behavioral_score_json": json.dumps(behavioral_score, default=str, indent=2),
                "policy_scores_json": json.dumps(evaluations, default=str, indent=2),
                "format_instructions": self._parser.get_format_instructions(),
            }

            self.log_step("Invoking Gemini for recommendation synthesis")
            result = self._chain.invoke(payload)  # could be dict or Pydantic model

            # Normalize to ProductRecommendation model when possible
            rec_model = None
            try:
                if hasattr(result, "model_dump"):
                    # It's a Pydantic model (or similar)
                    try:
                        # Try to update metadata in-place, otherwise use model_copy
                        result.metadata = {
                            "evaluation_timestamp": datetime.now().isoformat(),
                            "engine": "LangChain-Gemini",
                        }
                        rec_model = result
                    except Exception:
                        rec_model = result.model_copy(update={
                            "metadata": {
                                "evaluation_timestamp": datetime.now().isoformat(),
                                "engine": "LangChain-Gemini",
                            }
                        })
                elif isinstance(result, dict):
                    # Validate/construct ProductRecommendation
                    try:
                        rec_model = ProductRecommendation(**result)
                        rec_model = rec_model.model_copy(update={
                            "metadata": {
                                "evaluation_timestamp": datetime.now().isoformat(),
                                "engine": "LangChain-Gemini",
                            }
                        })
                    except Exception:
                        rec_model = None
            except Exception as e:
                self.logger.exception("Failed to normalize policy matching result: %s", e)
                rec_model = None

            # If normalization failed, fall back to deterministic construction
            if rec_model is None:
                self.logger.warning("LLM returned unexpected format; using deterministic recommendation")
                rec_model = ProductRecommendation(
                    best_fit_products=[self._dict_to_eligibility(e) for e in evaluations[:3]],
                    alternative_products=[self._dict_to_eligibility(e) for e in evaluations[3:6]],
                    total_products_evaluated=len(evaluations),
                    matching_criteria_used=self._get_matching_criteria(),
                    metadata={
                        "fallback": True,
                        "evaluation_timestamp": datetime.now().isoformat(),
                    },
                )

            # Ensure fields are set/updated
            try:
                rec_model = rec_model.model_copy(update={
                    "total_products_evaluated": len(evaluations),
                    "matching_criteria_used": self._get_matching_criteria(),
                    "metadata": {**(getattr(rec_model, 'metadata', {}) or {}), "engine": "LangChain-Gemini"}
                })
            except Exception:
                # If model_copy not available, attempt attribute assignment
                try:
                    rec_model.total_products_evaluated = len(evaluations)
                    rec_model.matching_criteria_used = self._get_matching_criteria()
                    rec_model.metadata = {**(getattr(rec_model, 'metadata', {}) or {}), "engine": "LangChain-Gemini"}
                except Exception:
                    self.logger.exception("Unable to set fields on ProductRecommendation model")

            self.log_step("Policy matching completed successfully")

            return self.create_output(
                success=True,
                data=rec_model.model_dump() if hasattr(rec_model, "model_dump") else dict(rec_model),
                metadata={
                    "agent": self.name,
                    "timestamp": datetime.now().isoformat(),
                },
            )

        except Exception as exc:
            self.logger.error("Error in policy matching", exc_info=True)
            fallback = self._fallback_recommendation(financial_health, behavioral_score, msme_profile)
            return self.create_output(
                success=False,
                data=fallback,
                errors=[f"Policy matching failed: {exc}"],
            )
    
    def _load_policies(self) -> List[Dict[str, Any]]:
        """Load lender policies from storage."""
        policies = []
        
        # Try to load from file
        policy_file = os.path.join(settings.DATA_DIR, 'lender_policies.json')
        if os.path.exists(policy_file):
            try:
                with open(policy_file, 'r') as f:
                    policies = json.load(f)
                self.logger.info(f"Loaded {len(policies)} policies from file")
            except Exception as e:
                self.logger.warning(f"Could not load policies from file: {e}")
        
        # If no file, use default policies
        if not policies:
            policies = self._get_default_policies()
            self.logger.info(f"Using {len(policies)} default policies")
        
        return policies
    
    def _get_default_policies(self) -> List[Dict[str, Any]]:
        """Get default lender policies for demonstration."""
        return [
            {
                "product_id": "working_capital_001",
                "product_name": "Quick Working Capital Loan",
                "lender_name": "FastLend Finance",
                "eligibility_criteria": {
                    "min_net_cashflow": 10000,
                    "min_behavioral_score": 500,
                    "max_volatility": 0.7,
                    "min_stability_score": 0.4,
                    "max_red_flags": 2
                },
                "risk_buckets": {
                    "low": {"behavioral_score": [700], "volatility": 0.3},
                    "medium": {"behavioral_score": [500, 700], "volatility": [0.3, 0.6]},
                    "high": {"behavioral_score": [400, 500], "volatility": [0.6, 0.8]}
                },
                "amount_range": {"min": 50000, "max": 500000},
                "interest_rate_range": {"low": 12.0, "medium": 15.0, "high": 18.0}
            },
            {
                "product_id": "term_loan_001",
                "product_name": "MSME Term Loan",
                "lender_name": "SecureBank",
                "eligibility_criteria": {
                    "min_net_cashflow": 20000,
                    "min_behavioral_score": 600,
                    "max_volatility": 0.5,
                    "min_stability_score": 0.6,
                    "max_red_flags": 1
                },
                "risk_buckets": {
                    "low": {"behavioral_score": [750], "volatility": 0.25},
                    "medium": {"behavioral_score": [600, 750], "volatility": [0.25, 0.4]},
                    "high": {"behavioral_score": [500, 600], "volatility": [0.4, 0.5]}
                },
                "amount_range": {"min": 100000, "max": 2000000},
                "interest_rate_range": {"low": 10.0, "medium": 13.0, "high": 16.0}
            },
            {
                "product_id": "invoice_financing_001",
                "product_name": "Invoice Financing",
                "lender_name": "InvoiceFlow Capital",
                "eligibility_criteria": {
                    "min_net_cashflow": 5000,
                    "min_behavioral_score": 400,
                    "max_volatility": 0.8,
                    "min_stability_score": 0.3,
                    "max_red_flags": 3
                },
                "risk_buckets": {
                    "low": {"behavioral_score": [600], "volatility": 0.4},
                    "medium": {"behavioral_score": [400, 600], "volatility": [0.4, 0.6]},
                    "high": {"behavioral_score": [300, 400], "volatility": [0.6, 0.8]}
                },
                "amount_range": {"min": 25000, "max": 1000000},
                "interest_rate_range": {"low": 14.0, "medium": 17.0, "high": 20.0}
            }
        ]
    
    def _evaluate_product(
        self,
        product: Dict[str, Any],
        financial_health: Dict[str, Any],
        behavioral_score: Dict[str, Any],
        msme_profile: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Evaluate a single product for eligibility."""
        criteria = product.get('eligibility_criteria', {})
        reasons = []
        requirements_met = {}
        
        # Check net cashflow
        net_cashflow = financial_health.get('net_cashflow', 0)
        min_cashflow = criteria.get('min_net_cashflow', 0)
        cashflow_met = net_cashflow >= min_cashflow
        requirements_met['net_cashflow'] = cashflow_met
        if not cashflow_met:
            reasons.append(f"Net cashflow {net_cashflow:,.2f} below minimum {min_cashflow:,.2f}")
        
        # Check behavioral score
        score = behavioral_score.get('behavioral_score', 0)
        min_score = criteria.get('min_behavioral_score', 0)
        score_met = score >= min_score
        requirements_met['behavioral_score'] = score_met
        if not score_met:
            reasons.append(f"Behavioral score {score:.0f} below minimum {min_score:.0f}")
        
        # Check volatility
        volatility = financial_health.get('volatility_score', 1.0)
        max_volatility = criteria.get('max_volatility', 1.0)
        volatility_met = volatility <= max_volatility
        requirements_met['volatility'] = volatility_met
        if not volatility_met:
            reasons.append(f"Volatility {volatility:.2f} exceeds maximum {max_volatility:.2f}")
        
        # Check stability
        stability = financial_health.get('cashflow_stability_score', 0)
        min_stability = criteria.get('min_stability_score', 0)
        stability_met = stability >= min_stability
        requirements_met['stability'] = stability_met
        if not stability_met:
            reasons.append(f"Stability score {stability:.2f} below minimum {min_stability:.2f}")
        
        # Check red flags
        red_flags = behavioral_score.get('red_flags', [])
        max_red_flags = criteria.get('max_red_flags', 999)
        red_flags_met = len(red_flags) <= max_red_flags
        requirements_met['red_flags'] = red_flags_met
        if not red_flags_met:
            reasons.append(f"Red flags count {len(red_flags)} exceeds maximum {max_red_flags}")
        
        # Determine eligibility
        eligible = all(requirements_met.values())
        
        # Calculate eligibility score (0-100)
        met_count = sum(requirements_met.values())
        total_count = len(requirements_met)
        eligibility_score = (met_count / total_count) * 100 if total_count > 0 else 0
        
        # Determine risk bucket
        risk_bucket = self._determine_risk_bucket(
            product,
            score,
            volatility
        )
        
        # Calculate recommended amount
        recommended_amount = self._calculate_recommended_amount(
            product,
            financial_health,
            behavioral_score
        )
        
        # Get interest rate
        interest_rate_range = self._get_interest_rate(product, risk_bucket)
        
        return {
            'product_id': product['product_id'],
            'product_name': product['product_name'],
            'lender_name': product['lender_name'],
            'eligible': eligible,
            'eligibility_score': eligibility_score,
            'risk_bucket': risk_bucket,
            'recommended_amount': recommended_amount,
            'interest_rate_range': interest_rate_range,
            'reasons': reasons,
            'requirements_met': requirements_met
        }

    def _fallback_recommendation(
        self,
        financial_health: Dict[str, Any],
        behavioral_score: Dict[str, Any],
        msme_profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Deterministic fallback recommendation if the LLM call fails."""
        evaluations = [
            eval_result
            for product in self.policies
            if (eval_result := self._evaluate_product(product, financial_health, behavioral_score, msme_profile))
        ]
        evaluations.sort(key=lambda x: x["eligibility_score"], reverse=True)
        recommendation = ProductRecommendation(
            best_fit_products=[self._dict_to_eligibility(e) for e in evaluations[:3]],
            alternative_products=[self._dict_to_eligibility(e) for e in evaluations[3:6]],
            total_products_evaluated=len(evaluations),
            matching_criteria_used=self._get_matching_criteria(),
            metadata={"fallback": True},
        )
        return recommendation.model_dump()
    
    def _determine_risk_bucket(self, product: Dict[str, Any], score: float, volatility: float) -> str:
        """Determine risk bucket for the product."""
        buckets = product.get('risk_buckets', {})
        
        # Check each bucket
        for bucket_name, bucket_criteria in buckets.items():
            score_range = bucket_criteria.get('behavioral_score', [])
            vol_range = bucket_criteria.get('volatility', [])
            
            # Check score
            score_match = False
            if isinstance(score_range, list):
                if len(score_range) == 1:
                    score_match = score >= score_range[0]
                elif len(score_range) == 2:
                    score_match = score_range[0] <= score <= score_range[1]
            else:
                score_match = score >= score_range
            
            # Check volatility
            vol_match = False
            if isinstance(vol_range, list):
                if len(vol_range) == 1:
                    vol_match = volatility <= vol_range[0]
                elif len(vol_range) == 2:
                    vol_match = vol_range[0] <= volatility <= vol_range[1]
            else:
                vol_match = volatility <= vol_range
            
            if score_match and vol_match:
                return bucket_name
        
        # Default to high risk if no match
        return "high"
    
    def _calculate_recommended_amount(
        self,
        product: Dict[str, Any],
        financial_health: Dict[str, Any],
        behavioral_score: Dict[str, Any]
    ) -> Optional[float]:
        """Calculate recommended loan amount."""
        amount_range = product.get('amount_range', {})
        min_amount = amount_range.get('min', 0)
        max_amount = amount_range.get('max', 0)
        
        if min_amount == 0 or max_amount == 0:
            return None
        
        # Base recommendation on net cashflow and score
        net_cashflow = financial_health.get('net_cashflow', 0)
        score = behavioral_score.get('behavioral_score', 500)
        
        # Simple heuristic: 3-6 months of net cashflow, adjusted by score
        score_factor = score / 1000  # 0-1
        months_factor = 4 * score_factor + 2  # 2-6 months
        
        recommended = net_cashflow * months_factor
        
        # Clamp to range
        recommended = max(min_amount, min(max_amount, recommended))
        
        return round(recommended, 2)
    
    def _get_interest_rate(self, product: Dict[str, Any], risk_bucket: str) -> Optional[Dict[str, float]]:
        """Get interest rate range for risk bucket."""
        rate_range = product.get('interest_rate_range', {})
        if not rate_range:
            return None
        
        rate = rate_range.get(risk_bucket, rate_range.get('medium', 15.0))
        
        return {
            'min': rate - 1.0,
            'max': rate + 1.0,
            'typical': rate
        }
    
    def _dict_to_eligibility(self, eval_dict: Dict[str, Any]) -> ProductEligibility:
        """Convert evaluation dictionary to ProductEligibility model."""
        return ProductEligibility(
            product_id=eval_dict['product_id'],
            product_name=eval_dict['product_name'],
            lender_name=eval_dict['lender_name'],
            eligible=eval_dict['eligible'],
            eligibility_score=eval_dict['eligibility_score'],
            risk_bucket=eval_dict['risk_bucket'],
            recommended_amount=eval_dict.get('recommended_amount'),
            interest_rate_range=eval_dict.get('interest_rate_range'),
            reasons=eval_dict.get('reasons', []),
            requirements_met=eval_dict.get('requirements_met', {})
        )
    
    def _get_matching_criteria(self) -> List[str]:
        """Get list of matching criteria used."""
        return [
            "net_cashflow",
            "behavioral_score",
            "volatility_score",
            "cashflow_stability_score",
            "red_flags_count"
        ]

