"""
Type definitions and Pydantic models for the MSME Credit Intelligence Platform.
"""

from typing import List, Dict, Optional, Any, Union
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class TransactionType(str, Enum):
    """Transaction type enumeration."""
    CREDIT = "credit"
    DEBIT = "debit"
    EMI = "emi"
    GST_PAYMENT = "gst_payment"
    GST_RECEIPT = "gst_receipt"
    CASHFLOW_IN = "cashflow_in"
    CASHFLOW_OUT = "cashflow_out"
    UNKNOWN = "unknown"


class CashflowCategory(str, Enum):
    """Cashflow category enumeration."""
    OPERATIONAL = "operational"
    INVESTMENT = "investment"
    FINANCING = "financing"
    TAX = "tax"
    OTHER = "other"


class RiskLevel(str, Enum):
    """Risk level enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Transaction(BaseModel):
    """Individual transaction model."""
    date: datetime
    amount: float
    description: str
    type: TransactionType
    category: Optional[CashflowCategory] = None
    balance_after: Optional[float] = None


class FinancialHealthSummary(BaseModel):
    """Financial Health Agent output."""
    total_inflow: float
    total_outflow: float
    net_cashflow: float
    average_balance: float
    min_balance: float
    max_balance: float
    volatility_score: float = Field(ge=0, le=1)
    seasonality_detected: bool
    stress_indicators: List[str]
    cashflow_stability_score: float = Field(ge=0, le=1)
    transaction_count: int
    period_start: datetime
    period_end: datetime
    categorized_transactions: Dict[str, int]
    metadata: Dict[str, Any] = {}


class BehavioralScore(BaseModel):
    """Credit Scoring Agent output."""
    behavioral_score: float = Field(ge=0, le=1000)
    repayment_pattern_score: float = Field(ge=0, le=100)
    concentration_risk_score: float = Field(ge=0, le=100)
    cyclicality_score: float = Field(ge=0, le=100)
    risk_level: RiskLevel
    red_flags: List[str]
    anomalies: List[Dict[str, Any]]
    confidence: float = Field(ge=0, le=1)
    metadata: Dict[str, Any] = {}


class ProductEligibility(BaseModel):
    """Product eligibility model."""
    product_id: str
    product_name: str
    lender_name: str
    eligible: bool
    eligibility_score: float = Field(ge=0, le=100)
    risk_bucket: str
    recommended_amount: Optional[float] = None
    interest_rate_range: Optional[Dict[str, float]] = None
    reasons: List[str]
    requirements_met: Dict[str, bool]


class ProductRecommendation(BaseModel):
    """Policy Matching Agent output."""
    best_fit_products: List[ProductEligibility]
    alternative_products: List[ProductEligibility]
    total_products_evaluated: int
    matching_criteria_used: List[str]
    metadata: Dict[str, Any] = {}


class ExplainabilityReport(BaseModel):
    """Guidance/Explainability Agent output."""
    score_explanations: Dict[str, str]
    improvement_recommendations: List[Dict[str, str]]
    lender_arguments: Dict[str, str]
    key_insights: List[str]
    risk_factors: List[Dict[str, str]]
    strengths: List[str]
    weaknesses: List[str]
    metadata: Dict[str, Any] = {}


class HealthAnalysisSummary(BaseModel):
    """Health Analysis Agent output."""
    monthly_inflow: Dict[str, float]  # Month -> total inflow
    monthly_outflow: Dict[str, float]  # Month -> total outflow
    net_cashflow: float
    cashflow_volatility: float = Field(ge=0, le=1)
    avg_balance: float  # Average monthly balance
    low_balance_days: int  # Days with balance below threshold
    emi_transactions: int  # Count of EMI transactions
    cheque_bounces: int  # Count of cheque bounces
    overdraft_days: int  # Days with negative balance
    gst_analysis: Dict[str, Any]  # GST filing analysis
    period_start: datetime
    period_end: datetime
    metadata: Dict[str, Any] = {}


class RecommendationReport(BaseModel):
    """Recommendation Agent (xAI) output for profile improvement."""
    profile_improvement_recommendations: List[Dict[str, str]]  # List of recommendations with priority, category, action
    cashflow_optimization: List[str]
    gst_compliance_improvements: List[str]
    credit_score_enhancement: List[str]
    risk_mitigation: List[str]
    quick_wins: List[str]  # Easy improvements
    long_term_strategies: List[str]
    metadata: Dict[str, Any] = {}


class UnifiedCreditReport(BaseModel):
    """Final unified credit report."""
    msme_id: str
    report_id: str
    generated_at: datetime
    financial_health: FinancialHealthSummary
    behavioral_score: BehavioralScore
    product_recommendations: ProductRecommendation
    explainability: ExplainabilityReport
    health_analysis: Optional[HealthAnalysisSummary] = None
    recommendations: Optional[RecommendationReport] = None
    overall_creditworthiness: float = Field(ge=0, le=100)
    summary: str
    metadata: Dict[str, Any] = {}


class AgentInput(BaseModel):
    """Base input model for agents."""
    data: Dict[str, Any]
    context: Optional[Dict[str, Any]] = {}


class AgentOutput(BaseModel):
    """Base output model for agents."""
    success: bool
    data: Dict[str, Any]
    errors: List[str] = []
    metadata: Dict[str, Any] = {}

