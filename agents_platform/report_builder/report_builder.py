"""
Unified Credit Report Builder - Utilities for building and formatting reports.
"""

from typing import Dict, Any, Optional
from datetime import datetime
import json

from ..core.types import UnifiedCreditReport


class ReportBuilder:
    """
    Utility class for building and formatting unified credit reports.
    """
    
    @staticmethod
    def to_json(report: UnifiedCreditReport, indent: int = 2) -> str:
        """
        Convert unified report to JSON string.
        
        Args:
            report: UnifiedCreditReport instance
            indent: JSON indentation level
            
        Returns:
            JSON string
        """
        return json.dumps(report.model_dump(), indent=indent, default=str)
    
    @staticmethod
    def to_dict(report: UnifiedCreditReport) -> Dict[str, Any]:
        """
        Convert unified report to dictionary.
        
        Args:
            report: UnifiedCreditReport instance
            
        Returns:
            Dictionary representation
        """
        return report.model_dump()
    
    @staticmethod
    def to_summary(report: UnifiedCreditReport) -> Dict[str, Any]:
        """
        Extract summary information from report.
        
        Args:
            report: UnifiedCreditReport instance
            
        Returns:
            Summary dictionary
        """
        return {
            'report_id': report.report_id,
            'msme_id': report.msme_id,
            'generated_at': report.generated_at.isoformat(),
            'overall_creditworthiness': report.overall_creditworthiness,
            'summary': report.summary,
            'risk_level': report.behavioral_score.risk_level.value,
            'behavioral_score': report.behavioral_score.behavioral_score,
            'net_cashflow': report.financial_health.net_cashflow,
            'best_fit_products_count': len(report.product_recommendations.best_fit_products),
            'key_insights': report.explainability.key_insights[:3]  # Top 3 insights
        }
    
    @staticmethod
    def format_for_lender(report: UnifiedCreditReport) -> Dict[str, Any]:
        """
        Format report specifically for lender consumption.
        
        Args:
            report: UnifiedCreditReport instance
            
        Returns:
            Lender-formatted dictionary
        """
        return {
            'report_id': report.report_id,
            'msme_id': report.msme_id,
            'creditworthiness_score': report.overall_creditworthiness,
            'risk_assessment': {
                'level': report.behavioral_score.risk_level.value,
                'behavioral_score': report.behavioral_score.behavioral_score,
                'red_flags': report.behavioral_score.red_flags,
                'anomalies_count': len(report.behavioral_score.anomalies)
            },
            'financial_health': {
                'net_cashflow': report.financial_health.net_cashflow,
                'stability_score': report.financial_health.cashflow_stability_score,
                'volatility_score': report.financial_health.volatility_score,
                'stress_indicators': report.financial_health.stress_indicators
            },
            'product_recommendations': [
                {
                    'product_id': p.product_id,
                    'product_name': p.product_name,
                    'lender_name': p.lender_name,
                    'eligible': p.eligible,
                    'eligibility_score': p.eligibility_score,
                    'risk_bucket': p.risk_bucket,
                    'recommended_amount': p.recommended_amount,
                    'interest_rate_range': p.interest_rate_range
                }
                for p in report.product_recommendations.best_fit_products
            ],
            'lender_arguments': report.explainability.lender_arguments,
            'generated_at': report.generated_at.isoformat()
        }
    
    @staticmethod
    def format_for_msme(report: UnifiedCreditReport) -> Dict[str, Any]:
        """
        Format report specifically for MSME consumption.
        
        Args:
            report: UnifiedCreditReport instance
            
        Returns:
            MSME-formatted dictionary
        """
        return {
            'report_id': report.report_id,
            'creditworthiness_score': report.overall_creditworthiness,
            'summary': report.summary,
            'financial_health': {
                'net_cashflow': report.financial_health.net_cashflow,
                'total_inflow': report.financial_health.total_inflow,
                'total_outflow': report.financial_health.total_outflow,
                'average_balance': report.financial_health.average_balance
            },
            'behavioral_score': {
                'score': report.behavioral_score.behavioral_score,
                'risk_level': report.behavioral_score.risk_level.value,
                'confidence': report.behavioral_score.confidence
            },
            'score_explanations': report.explainability.score_explanations,
            'improvement_recommendations': report.explainability.improvement_recommendations,
            'strengths': report.explainability.strengths,
            'weaknesses': report.explainability.weaknesses,
            'key_insights': report.explainability.key_insights,
            'product_recommendations': [
                {
                    'product_name': p.product_name,
                    'lender_name': p.lender_name,
                    'eligible': p.eligible,
                    'reasons': p.reasons if not p.eligible else []
                }
                for p in report.product_recommendations.best_fit_products[:3]
            ],
            'generated_at': report.generated_at.isoformat()
        }

