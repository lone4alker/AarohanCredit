"""
FastAPI main application.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime
import logging
import uuid

from ..core.config import settings
from ..orchestrator.orchestrator import OrchestratorAgent
from ..report_builder.report_builder import ReportBuilder
from ..core.types import UnifiedCreditReport
from ..agents.financial_health_agent import FinancialHealthAgent
from ..agents.credit_scoring_agent import CreditScoringAgent
from ..agents.policy_matching_agent import PolicyMatchingAgent
from ..agents.explainability_agent import ExplainabilityAgent

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description="Agentic AI Orchestrator for MSME Credit Intelligence"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize orchestrator
orchestrator = OrchestratorAgent()
financial_health_agent = FinancialHealthAgent()
credit_scoring_agent = CreditScoringAgent()
policy_matching_agent = PolicyMatchingAgent()
explainability_agent = ExplainabilityAgent()


# Request/Response Models
class AnalysisRequest(BaseModel):
    """Request model for credit analysis."""
    transactions: Optional[List[Dict[str, Any]]] = None
    file_path: Optional[str] = None
    msme_profile: Optional[Dict[str, Any]] = {}
    context: Optional[Dict[str, Any]] = {}


class AnalysisResponse(BaseModel):
    """Response model for credit analysis."""
    success: bool
    report_id: str
    msme_id: str
    overall_creditworthiness: float
    summary: str
    generated_at: str
    errors: List[str] = []


class ReportSummaryResponse(BaseModel):
class AgentInvocationResponse(BaseModel):
    """Generic response for single-agent invocations."""

    success: bool
    data: Dict[str, Any]
    errors: List[str] = []
    metadata: Dict[str, Any] = Field(default_factory=dict)


class FinancialHealthRequest(BaseModel):
    transactions: Optional[List[Dict[str, Any]]] = None
    file_path: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


class CreditScoringRequest(BaseModel):
    transactions: Optional[List[Dict[str, Any]]] = None
    financial_health: Optional[Dict[str, Any]] = None
    context: Optional[Dict[str, Any]] = None


class PolicyMatchingRequest(BaseModel):
    financial_health: Dict[str, Any]
    behavioral_score: Dict[str, Any]
    msme_profile: Optional[Dict[str, Any]] = None
    context: Optional[Dict[str, Any]] = None


class ExplainabilityRequest(BaseModel):
    financial_health: Dict[str, Any]
    behavioral_score: Dict[str, Any]
    product_recommendations: Dict[str, Any]
    context: Optional[Dict[str, Any]] = None


# In-memory storage for reports (use database in production)
reports_storage: Dict[str, Dict[str, Any]] = {}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": settings.API_TITLE,
        "version": settings.API_VERSION,
        "status": "operational",
        "endpoints": {
            "analyze": "/api/v1/analyze",
            "financial_health_agent": "/api/v1/agent/financial-health",
            "credit_scoring_agent": "/api/v1/agent/credit-scoring",
            "policy_matching_agent": "/api/v1/agent/policy-matching",
            "explainability_agent": "/api/v1/agent/explainability",
            "report": "/api/v1/report/{report_id}",
            "summary": "/api/v1/report/{report_id}/summary",
            "lender_view": "/api/v1/report/{report_id}/lender",
            "msme_view": "/api/v1/report/{report_id}/msme",
            "health": "/health"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": settings.API_TITLE
    }


@app.post("/api/v1/analyze", response_model=AnalysisResponse)
async def analyze_credit(
    request: AnalysisRequest,
    background_tasks: BackgroundTasks
):
    """
    Analyze MSME credit profile using the agentic orchestrator.
    
    This endpoint triggers the complete analysis pipeline:
    1. Financial Health Analysis
    2. Credit Scoring
    3. Policy Matching
    4. Explainability
    5. Unified Report Generation
    """
    try:
        logger.info("Received credit analysis request")
        
        # Prepare input data
        input_data = {}
        if request.transactions:
            input_data['transactions'] = request.transactions
        if request.file_path:
            input_data['file_path'] = request.file_path
        
        input_data['msme_profile'] = request.msme_profile or {}
        
        # Prepare context
        context = request.context.copy() if request.context else {}
        msme_id = context.get('msme_id', f"msme_{uuid.uuid4().hex[:8]}")
        context['msme_id'] = msme_id
        
        # Run orchestrator
        result = orchestrator.run(input_data, context)
        
        if not result.success:
            raise HTTPException(
                status_code=500,
                detail=f"Analysis failed: {', '.join(result.errors)}"
            )
        
        # Convert to UnifiedCreditReport
        report = UnifiedCreditReport(**result.data)
        
        # Store report
        report_id = report.report_id
        reports_storage[report_id] = result.data
        
        logger.info(f"Analysis completed successfully. Report ID: {report_id}")
        
        return AnalysisResponse(
            success=True,
            report_id=report_id,
            msme_id=report.msme_id,
            overall_creditworthiness=report.overall_creditworthiness,
            summary=report.summary,
            generated_at=report.generated_at.isoformat(),
            errors=[]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in analyze endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


def _agent_response(agent_output) -> AgentInvocationResponse:
    return AgentInvocationResponse(
        success=agent_output.success,
        data=agent_output.data,
        errors=agent_output.errors,
        metadata=agent_output.metadata,
    )


@app.post("/api/v1/agent/financial-health", response_model=AgentInvocationResponse)
async def run_financial_health_agent_endpoint(request: FinancialHealthRequest):
    """Run only the Financial Health Agent."""
    payload: Dict[str, Any] = {}
    if request.transactions:
        payload["transactions"] = request.transactions
    if request.file_path:
        payload["file_path"] = request.file_path

    result = financial_health_agent.run(payload, request.context or {})
    return _agent_response(result)


@app.post("/api/v1/agent/credit-scoring", response_model=AgentInvocationResponse)
async def run_credit_scoring_agent_endpoint(request: CreditScoringRequest):
    """Run only the Credit Scoring Agent."""
    payload = {
        "transactions": request.transactions or [],
        "financial_health": request.financial_health or {},
    }
    result = credit_scoring_agent.run(payload, request.context or {})
    return _agent_response(result)


@app.post("/api/v1/agent/policy-matching", response_model=AgentInvocationResponse)
async def run_policy_matching_agent_endpoint(request: PolicyMatchingRequest):
    """Run only the Policy Matching Agent."""
    payload = {
        "financial_health": request.financial_health,
        "behavioral_score": request.behavioral_score,
        "msme_profile": request.msme_profile or {},
    }
    result = policy_matching_agent.run(payload, request.context or {})
    return _agent_response(result)


@app.post("/api/v1/agent/explainability", response_model=AgentInvocationResponse)
async def run_explainability_agent_endpoint(request: ExplainabilityRequest):
    """Run only the Explainability Agent."""
    payload = {
        "financial_health": request.financial_health,
        "behavioral_score": request.behavioral_score,
        "product_recommendations": request.product_recommendations,
    }
    result = explainability_agent.run(payload, request.context or {})
    return _agent_response(result)


@app.get("/api/v1/report/{report_id}")
async def get_report(report_id: str):
    """
    Get full credit report by report ID.
    """
    if report_id not in reports_storage:
        raise HTTPException(
            status_code=404,
            detail=f"Report {report_id} not found"
        )
    
    report_data = reports_storage[report_id]
    report = UnifiedCreditReport(**report_data)
    
    return ReportBuilder.to_dict(report)


@app.get("/api/v1/report/{report_id}/summary", response_model=ReportSummaryResponse)
async def get_report_summary(report_id: str):
    """
    Get summary of credit report.
    """
    if report_id not in reports_storage:
        raise HTTPException(
            status_code=404,
            detail=f"Report {report_id} not found"
        )
    
    report_data = reports_storage[report_id]
    report = UnifiedCreditReport(**report_data)
    summary = ReportBuilder.to_summary(report)
    
    return ReportSummaryResponse(**summary)


@app.get("/api/v1/report/{report_id}/lender")
async def get_lender_view(report_id: str):
    """
    Get lender-formatted view of the report.
    """
    if report_id not in reports_storage:
        raise HTTPException(
            status_code=404,
            detail=f"Report {report_id} not found"
        )
    
    report_data = reports_storage[report_id]
    report = UnifiedCreditReport(**report_data)
    
    return ReportBuilder.format_for_lender(report)


@app.get("/api/v1/report/{report_id}/msme")
async def get_msme_view(report_id: str):
    """
    Get MSME-formatted view of the report.
    """
    if report_id not in reports_storage:
        raise HTTPException(
            status_code=404,
            detail=f"Report {report_id} not found"
        )
    
    report_data = reports_storage[report_id]
    report = UnifiedCreditReport(**report_data)
    
    return ReportBuilder.format_for_msme(report)


@app.get("/api/v1/report/{report_id}/json")
async def get_report_json(report_id: str):
    """
    Get full report as JSON string.
    """
    if report_id not in reports_storage:
        raise HTTPException(
            status_code=404,
            detail=f"Report {report_id} not found"
        )
    
    report_data = reports_storage[report_id]
    report = UnifiedCreditReport(**report_data)
    
    return {
        "report_id": report_id,
        "json": ReportBuilder.to_json(report)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "agents_platform.api.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )

