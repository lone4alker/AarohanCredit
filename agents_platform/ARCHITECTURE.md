# Architecture Documentation

## System Architecture

### Overview

The MSME Credit Intelligence Platform follows an **agentic AI architecture** where specialized agents work together to analyze financial data and produce comprehensive credit intelligence reports.

### Core Principles

1. **Agent-as-a-Service**: Each agent is an independent service with a standardized interface
2. **Separation of Concerns**: Tools handle data processing, agents handle reasoning
3. **Type Safety**: Pydantic models ensure data integrity
4. **Modularity**: Components can be developed, tested, and deployed independently
5. **Explainability**: All decisions are transparent and explainable

---

## Component Architecture

### 1. Core Layer (`core/`)

**Purpose**: Foundation for all other components

**Components**:
- `types.py`: Pydantic models for type safety
- `config.py`: Configuration management
- `base_agent.py`: Base class for all agents

**Key Models**:
- `FinancialHealthSummary`
- `BehavioralScore`
- `ProductRecommendation`
- `ExplainabilityReport`
- `UnifiedCreditReport`

### 2. Tools Layer (`tools/`)

**Purpose**: Pure functions for data processing

**Components**:
- `data_parser.py`: Parse JSON, CSV, PDF files
- `transaction_categorizer.py`: Categorize transactions
- `financial_calculator.py`: Compute financial metrics
- `anomaly_detector.py`: Detect anomalies and red flags

**Design**: Tools are stateless, pure functions. No AI logic here.

### 3. Agents Layer (`agents/`)

**Purpose**: Specialized AI agents for different analysis tasks

**Framework**: Financial data prep relies on deterministic Python toolchains, while credit scoring, policy matching, explainability, and recommendation agents are implemented as LangChain `Runnable` pipelines backed by Google Gemini (see `core/llm.py`).

**Agents**:

#### Financial Health Agent
- **Input**: Raw transaction data
- **Process**: 
  1. Extract transactions
  2. Categorize transactions
  3. Detect patterns
  4. Compute metrics
- **Output**: `FinancialHealthSummary`

#### Credit Scoring Agent
- **Input**: Transactions + Financial Health
- **Process**:
  1. Analyze repayment patterns
  2. Assess concentration risk
  3. Analyze cyclicality
  4. Detect anomalies
  5. Compute behavioral score
- **Output**: `BehavioralScore`

#### Policy Matching Agent
- **Input**: Financial Health + Behavioral Score + MSME Profile
- **Process**:
  1. Load lender policies
  2. Evaluate each product
  3. Rank products
  4. Determine risk buckets
- **Output**: `ProductRecommendation`

#### Explainability Agent
- **Input**: All previous outputs
- **Process**:
  1. Explain scores
  2. Generate recommendations
  3. Create lender arguments
  4. Extract insights
- **Output**: `ExplainabilityReport`

#### Health Analysis Agent
- **Input**: Raw transactions (and optional derived metrics)
- **Process**:
  1. Analyze operational health signals (e.g., overdraft/low-balance days)
  2. Summarize GST-related signals when available
  3. Detect cheque bounce and EMI patterns
- **Output**: `HealthAnalysisSummary` (optional in unified report)

#### Recommendation Agent
- **Input**: MSME Profile + Financial Health + Health Analysis + Behavioral Score + Product Recommendations
- **Process**:
  1. Use Gemini to generate actionable profile improvement guidance
  2. Categorize into quick wins and long-term strategies
  3. Focus on cashflow optimization, GST compliance, score enhancement, risk mitigation
- **Output**: `RecommendationReport` (optional in unified report)

### 4. Orchestrator Layer (`orchestrator/`)

**Purpose**: Coordinate all agents and produce unified output

**Process**:
1. Execute Financial Health Agent
2. Execute Credit Scoring Agent (with financial health)
3. Execute Policy Matching Agent (with both outputs)
4. Execute Health Analysis Agent (additional operational signals)
5. Execute Explainability Agent (with previous outputs)
6. Execute Recommendation Agent (aggregated guidance)
7. Build Unified Credit Report

**Error Handling**: Continues with partial data if non-critical agents fail
- Financial Health is critical (pipeline stops on failure)
- Policy Matching, Explainability, Health Analysis, Recommendation are non-critical; pipeline continues with sensible fallbacks

### 5. API Layer (`api/`)

**Purpose**: REST API for external integration

**Endpoints**:
- `POST /api/v1/analyze`: Trigger full orchestrator
- `POST /api/v1/agent/financial-health`
- `POST /api/v1/agent/credit-scoring`
- `POST /api/v1/agent/policy-matching`
- `POST /api/v1/agent/explainability`
- `POST /api/v1/agent/health-analysis` (optional)
- `POST /api/v1/agent/recommendation` (optional)
- `GET /api/v1/report/{id}`: Get full report
- `GET /api/v1/report/{id}/summary`: Get summary
- `GET /api/v1/report/{id}/lender`: Lender view
- `GET /api/v1/report/{id}/msme`: MSME view

### 6. Report Builder (`report_builder/`)

**Purpose**: Format reports for different audiences

**Formats**:
- JSON (full)
- Summary (key metrics)
- Lender view (decision-focused)
- MSME view (user-friendly)

---

## Data Flow

```
Input Data (JSON/CSV)
    │
    ▼
Orchestrator
    │
    ├──► Financial Health Agent
    │       │
    │       └──► Tools (parsing, categorization, calculations)
    │
    ├──► Credit Scoring Agent
    │       │
    │       └──► Tools (anomaly detection, pattern analysis)
    │
    ├──► Policy Matching Agent
    │       │
    │       └──► Policy Database/JSON
    │
    ├──► Health Analysis Agent
    │       │
    │       └──► Tools (operational signals, GST heuristics)
    │
    ├──► Explainability Agent
            │
      └──► All previous outputs
    │
    └──► Recommendation Agent
      │
      └──► Aggregated outputs for guidance
    │
    ▼
Unified Credit Report
    │
    ├──► JSON Format
    ├──► Summary Format
    ├──► Lender Format
    └──► MSME Format
```

---

## Agent Interface

All agents implement the `BaseAgent` interface:

```python
class BaseAgent(ABC):
    def run(self, input_data: Dict[str, Any], context: Optional[Dict] = None) -> AgentOutput:
        """
        Main entry point.
        Returns AgentOutput with success, data, errors, metadata.
        """
        pass
```

**Standard Flow**:
1. Validate input
2. Log reasoning steps
3. Call tools as needed
4. Process and reason
5. Create output
6. Handle errors gracefully

---

## Tool Interface

Tools are pure functions:

```python
def tool_function(input: Type) -> OutputType:
    """
    Pure function - no side effects.
    Processes data and returns result.
    """
    pass
```

**Characteristics**:
- Stateless
- Deterministic (same input = same output)
- No AI/ML logic
- Easy to test

---

## Configuration

Configuration via environment variables or `.env` file:

- **API Settings**: Host, port, title
- **Scoring Weights**: Customize scoring algorithm
  - Orchestrator combines components using `FINANCIAL_HEALTH_WEIGHT`, `BEHAVIORAL_SCORE_WEIGHT`, `POLICY_MATCH_WEIGHT` from `core/config.py`
- **Data Paths**: Where to store data
- **Agent Settings**: Timeouts, retries
- **Logging**: Log level, file paths

---

## Error Handling

**Strategy**:
- Agents return `AgentOutput` with success flag
- Orchestrator continues with partial data if non-critical agents fail
- Errors are logged and included in output
- API returns appropriate HTTP status codes

**Fallback**:
- If explainability fails: Continue with basic explanations
- If policy matching fails: Continue with empty recommendations
- If health analysis fails: Continue with `None` health analysis
- If recommendation fails: Continue with deterministic recommendations or `None`
- If financial health fails: Pipeline stops (critical)

---

## Scalability Considerations

**Current Design**:
- Synchronous execution
- In-memory storage (for demo)
- Single-threaded

**Production Enhancements**:
- Async agent execution
- Database persistence
- Caching layer
- Message queue for async processing
- Horizontal scaling with load balancer

---

## Security Considerations

**Current**:
- Input validation via Pydantic
- Type safety
- Error handling

**Production Needs**:
- Authentication/Authorization
- Rate limiting
- Input sanitization
- Data encryption
- Audit logging
- Compliance (GDPR, etc.)

---

## Testing Strategy

**Unit Tests**:
- Test each tool function
- Test each agent independently
- Mock dependencies

**Integration Tests**:
- Test orchestrator with all agents
- Test API endpoints
- Test end-to-end flow
 - Validate fallbacks when individual agents fail

**Example**:
```python
def test_financial_health_agent():
    agent = FinancialHealthAgent()
    input_data = {"transactions": [...]}
    result = agent.run(input_data)
    assert result.success
    assert "net_cashflow" in result.data
```

---

## Extension Points

### Adding a New Agent

1. Create class in `agents/`
2. Inherit from `BaseAgent`
3. Implement `run()` method
4. Add to orchestrator if needed
5. Add API endpoint if exposing directly

### Adding a New Tool

1. Create function in `tools/`
2. Follow pure function pattern
3. Add tests
4. Use in agents as needed

### Adding a New Output Format

1. Add method to `ReportBuilder`
2. Add API endpoint if needed
3. Update documentation

---

## Performance Considerations

**Optimization Opportunities**:
- Cache policy data
- Parallelize agent execution
- Batch transaction processing
- Use async I/O for file operations
- Database indexing for queries
 - Memoize LangChain inputs when appropriate

**Current Performance**:
- ~1-2 seconds for 20 transactions
- Scales linearly with transaction count
- Memory usage: ~50MB for typical analysis

---

## Monitoring & Observability

**Recommended Metrics**:
- Agent execution time
- Success/failure rates
- API response times
- Error rates
- Report generation time

**Logging**:
- Structured logging with levels
- Agent reasoning steps
- Error stack traces
- Performance metrics

---

## LLM Usage Notes

- Agents using Gemini via LangChain: `CreditScoringAgent`, `PolicyMatchingAgent`, `ExplainabilityAgent`, `RecommendationAgent`.
- Each such agent constructs a `ChatPromptTemplate`, invokes `get_gemini_llm()` (`core/llm.py`), and parses JSON with `JsonOutputParser` bound to the corresponding Pydantic model.
- Robust normalization ensures outputs are converted to model-compatible dicts even when LLM responses vary; deterministic fallbacks exist where applicable.

---

**Last Updated**: 2025-11-29

