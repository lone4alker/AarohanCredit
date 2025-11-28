"""
Orchestrator Agent - Coordinates all specialized agents and produces unified output.
"""

from typing import Dict, Any, Optional
from datetime import datetime
import uuid
import logging

from ..core.base_agent import BaseAgent
from ..core.types import AgentOutput, UnifiedCreditReport
from ..agents.financial_health_agent import FinancialHealthAgent
from ..agents.credit_scoring_agent import CreditScoringAgent
from ..agents.policy_matching_agent import PolicyMatchingAgent
from ..agents.explainability_agent import ExplainabilityAgent
from ..core.config import settings

logger = logging.getLogger(__name__)


class OrchestratorAgent(BaseAgent):
    """
    Orchestrator that coordinates all specialized agents.
    
    Responsibilities:
    - Route data to appropriate agents
    - Coordinate agent execution
    - Merge agent outputs
    - Handle fallback reasoning
    - Produce final unified credit report
    """
    
    def __init__(self):
        super().__init__(
            name="OrchestratorAgent",
            description="Coordinates all specialized agents for credit intelligence analysis"
        )
        
        # Initialize all agents
        self.financial_health_agent = FinancialHealthAgent()
        self.credit_scoring_agent = CreditScoringAgent()
        self.policy_matching_agent = PolicyMatchingAgent()
        self.explainability_agent = ExplainabilityAgent()
    
    def run(self, input_data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> AgentOutput:
        """
        Orchestrate the complete credit intelligence analysis pipeline.
        
        Args:
            input_data: Dictionary containing financial data (transactions, file paths, etc.)
            context: Optional context (e.g., msme_id, configuration)
            
        Returns:
            AgentOutput with UnifiedCreditReport
        """
        try:
            self.log_step("Starting orchestrator pipeline")
            
            msme_id = context.get('msme_id', 'unknown') if context else 'unknown'
            report_id = str(uuid.uuid4())
            
            # Step 1: Financial Health Analysis
            self.log_step("Step 1: Executing Financial Health Agent")
            financial_health_output = self.financial_health_agent.run(input_data, context)
            
            if not financial_health_output.success:
                return self.create_output(
                    success=False,
                    data={},
                    errors=[f"Financial Health Agent failed: {', '.join(financial_health_output.errors)}"]
                )
            
            financial_health = financial_health_output.data
            
            # Step 2: Credit Scoring Analysis
            self.log_step("Step 2: Executing Credit Scoring Agent")
            credit_scoring_input = {
                'transactions': input_data.get('transactions', []),
                'financial_health': financial_health
            }
            credit_scoring_output = self.credit_scoring_agent.run(credit_scoring_input, context)
            
            if not credit_scoring_output.success:
                return self.create_output(
                    success=False,
                    data={},
                    errors=[f"Credit Scoring Agent failed: {', '.join(credit_scoring_output.errors)}"]
                )
            
            behavioral_score = credit_scoring_output.data
            
            # Step 3: Policy Matching Analysis
            self.log_step("Step 3: Executing Policy Matching Agent")
            policy_matching_input = {
                'financial_health': financial_health,
                'behavioral_score': behavioral_score,
                'msme_profile': input_data.get('msme_profile', {})
            }
            policy_matching_output = self.policy_matching_agent.run(policy_matching_input, context)
            
            if not policy_matching_output.success:
                # Policy matching failure is not critical, continue with empty recommendations
                self.logger.warning(f"Policy Matching Agent failed: {', '.join(policy_matching_output.errors)}")
                product_recommendations = {
                    'best_fit_products': [],
                    'alternative_products': [],
                    'total_products_evaluated': 0,
                    'matching_criteria_used': []
                }
            else:
                product_recommendations = policy_matching_output.data
            
            # Step 4: Explainability Analysis
            self.log_step("Step 4: Executing Explainability Agent")
            explainability_input = {
                'financial_health': financial_health,
                'behavioral_score': behavioral_score,
                'product_recommendations': product_recommendations
            }
            explainability_output = self.explainability_agent.run(explainability_input, context)
            
            if not explainability_output.success:
                # Explainability failure is not critical, continue with basic explanations
                self.logger.warning(f"Explainability Agent failed: {', '.join(explainability_output.errors)}")
                explainability = {
                    'score_explanations': {},
                    'improvement_recommendations': [],
                    'lender_arguments': {},
                    'key_insights': [],
                    'risk_factors': [],
                    'strengths': [],
                    'weaknesses': []
                }
            else:
                explainability = explainability_output.data
            
            # Step 5: Build Unified Credit Report
            self.log_step("Step 5: Building unified credit report")
            unified_report = self._build_unified_report(
                msme_id=msme_id,
                report_id=report_id,
                financial_health=financial_health,
                behavioral_score=behavioral_score,
                product_recommendations=product_recommendations,
                explainability=explainability
            )
            
            self.log_step("Orchestrator pipeline completed successfully")
            
            return self.create_output(
                success=True,
                data=unified_report.model_dump(),
                metadata={
                    'agent': self.name,
                    'timestamp': datetime.now().isoformat(),
                    'report_id': report_id,
                    'msme_id': msme_id
                }
            )
            
        except Exception as e:
            self.logger.error(f"Error in orchestrator pipeline: {str(e)}", exc_info=True)
            return self.create_output(
                success=False,
                data={},
                errors=[f"Orchestrator pipeline failed: {str(e)}"]
            )
    
    def _build_unified_report(
        self,
        msme_id: str,
        report_id: str,
        financial_health: Dict[str, Any],
        behavioral_score: Dict[str, Any],
        product_recommendations: Dict[str, Any],
        explainability: Dict[str, Any]
    ) -> UnifiedCreditReport:
        """
        Build the final unified credit report from all agent outputs.
        
        Args:
            msme_id: MSME identifier
            report_id: Unique report identifier
            financial_health: Financial health summary
            behavioral_score: Behavioral score data
            product_recommendations: Product recommendations
            explainability: Explainability report
            
        Returns:
            UnifiedCreditReport
        """
        # Calculate overall creditworthiness (0-100)
        overall_creditworthiness = self._calculate_overall_creditworthiness(
            financial_health,
            behavioral_score,
            product_recommendations
        )
        
        # Generate summary
        summary = self._generate_summary(
            financial_health,
            behavioral_score,
            product_recommendations,
            overall_creditworthiness
        )
        
        # Import models for conversion
        from ..core.types import (
            FinancialHealthSummary,
            BehavioralScore,
            ProductRecommendation,
            ExplainabilityReport
        )
        
        # Convert dictionaries to models
        financial_health_model = FinancialHealthSummary(**financial_health)
        behavioral_score_model = BehavioralScore(**behavioral_score)
        product_recommendations_model = ProductRecommendation(**product_recommendations)
        explainability_model = ExplainabilityReport(**explainability)
        
        # Build unified report
        report = UnifiedCreditReport(
            msme_id=msme_id,
            report_id=report_id,
            generated_at=datetime.now(),
            financial_health=financial_health_model,
            behavioral_score=behavioral_score_model,
            product_recommendations=product_recommendations_model,
            explainability=explainability_model,
            overall_creditworthiness=overall_creditworthiness,
            summary=summary,
            metadata={
                'generated_by': 'OrchestratorAgent',
                'version': settings.API_VERSION
            }
        )
        
        return report
    
    def _calculate_overall_creditworthiness(
        self,
        financial_health: Dict[str, Any],
        behavioral_score: Dict[str, Any],
        product_recommendations: Dict[str, Any]
    ) -> float:
        """
        Calculate overall creditworthiness score (0-100).
        
        Uses weighted combination of:
        - Financial health (30%)
        - Behavioral score (40%)
        - Product eligibility (30%)
        """
        # Financial health component (0-100)
        net_cf = financial_health.get('net_cashflow', 0)
        stability = financial_health.get('cashflow_stability_score', 0)
        volatility = financial_health.get('volatility_score', 0)
        
        # Normalize net cashflow (assume max 100000 for normalization)
        cf_score = min(100, max(0, (net_cf / 100000) * 100)) if net_cf > 0 else 0
        health_score = (cf_score * 0.4 + stability * 100 * 0.4 + (1 - volatility) * 100 * 0.2)
        
        # Behavioral score component (0-100)
        b_score = behavioral_score.get('behavioral_score', 0)
        behavioral_component = (b_score / 1000) * 100
        
        # Product eligibility component (0-100)
        best_fit = product_recommendations.get('best_fit_products', [])
        eligible_count = len([p for p in best_fit if p.get('eligible', False)])
        total_evaluated = product_recommendations.get('total_products_evaluated', 1)
        eligibility_score = (eligible_count / max(total_evaluated, 1)) * 100 if total_evaluated > 0 else 0
        
        # Weighted combination
        overall = (
            health_score * settings.FINANCIAL_HEALTH_WEIGHT +
            behavioral_component * settings.BEHAVIORAL_SCORE_WEIGHT +
            eligibility_score * settings.POLICY_MATCH_WEIGHT
        )
        
        return round(max(0, min(100, overall)), 2)
    
    def _generate_summary(
        self,
        financial_health: Dict[str, Any],
        behavioral_score: Dict[str, Any],
        product_recommendations: Dict[str, Any],
        overall_creditworthiness: float
    ) -> str:
        """Generate human-readable summary of the report."""
        net_cf = financial_health.get('net_cashflow', 0)
        b_score = behavioral_score.get('behavioral_score', 0)
        risk_level = behavioral_score.get('risk_level', 'medium')
        best_fit_count = len(product_recommendations.get('best_fit_products', []))
        
        summary = (
            f"This credit intelligence report evaluates the MSME's financial profile with an overall "
            f"creditworthiness score of {overall_creditworthiness:.1f}/100. "
            f"The analysis reveals a {risk_level} risk profile with a behavioral score of {b_score:.0f}/1000. "
        )
        
        if net_cf > 0:
            summary += f"The business demonstrates positive cashflow of ₹{net_cf:,.2f}. "
        else:
            summary += f"The business shows negative cashflow of ₹{abs(net_cf):,.2f}, requiring attention. "
        
        if best_fit_count > 0:
            summary += f"{best_fit_count} credit products have been identified as suitable matches. "
        else:
            summary += "Limited product eligibility based on current financial profile. "
        
        summary += "Detailed analysis and recommendations are provided in the respective sections."
        
        return summary

