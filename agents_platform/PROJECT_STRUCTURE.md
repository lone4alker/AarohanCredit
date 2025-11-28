# Project Structure

```
agents_platform/
│
├── 📁 core/                          # Core utilities and base classes
│   ├── __init__.py
│   ├── types.py                     # Pydantic models (FinancialHealthSummary, BehavioralScore, etc.)
│   ├── config.py                    # Configuration management (Settings class)
│   └── base_agent.py                # BaseAgent abstract class
│
├── 📁 tools/                         # Tool functions (data processing)
│   ├── __init__.py
│   ├── data_parser.py               # Parse JSON/CSV/PDF, extract transactions
│   ├── transaction_categorizer.py  # Categorize transactions, detect patterns
│   ├── financial_calculator.py     # Compute cashflow metrics, stability scores
│   └── anomaly_detector.py         # Detect anomalies and red flags
│
├── 📁 agents/                        # Specialized AI agents
│   ├── __init__.py
│   ├── financial_health_agent.py   # Financial health analysis
│   ├── credit_scoring_agent.py     # Behavioral credit scoring
│   ├── policy_matching_agent.py    # Product eligibility matching
│   └── explainability_agent.py     # Human-readable explanations
│
├── 📁 orchestrator/                  # Orchestrator agent
│   ├── __init__.py
│   └── orchestrator.py              # Coordinates all agents
│
├── 📁 report_builder/                # Report formatting utilities
│   ├── __init__.py
│   └── report_builder.py            # Format reports (JSON, summary, lender, MSME views)
│
├── 📁 api/                           # FastAPI REST API
│   ├── __init__.py
│   └── main.py                      # API endpoints and application
│
├── 📁 examples/                      # Examples and sample data
│   ├── __init__.py
│   ├── sample_data.json            # Sample transaction data
│   └── run_end_to_end.py           # End-to-end example script
│
├── 📁 data/                          # Data storage directory
│   └── .gitkeep                     # Placeholder for data files
│
├── 📄 __init__.py                    # Package initialization
├── 📄 setup.py                       # Package setup script
├── 📄 requirements.txt               # Python dependencies
├── 📄 env.example                    # Environment variables template
│
└── 📚 Documentation
    ├── README.md                     # Main documentation
    ├── QUICKSTART.md                 # Quick start guide
    ├── ARCHITECTURE.md               # Architecture documentation
    └── PROJECT_STRUCTURE.md          # This file
```

---

## File Descriptions

### Core (`core/`)

- **types.py**: All Pydantic models for type safety
  - `FinancialHealthSummary`
  - `BehavioralScore`
  - `ProductRecommendation`
  - `ExplainabilityReport`
  - `UnifiedCreditReport`
  - `AgentInput`, `AgentOutput`

- **config.py**: Configuration management using Pydantic Settings
  - API settings
  - Scoring weights
  - Data paths
  - Agent settings

- **base_agent.py**: Abstract base class for all agents
  - `run()` method interface
  - Logging utilities
  - Output creation helpers

### Tools (`tools/`)

- **data_parser.py**: 
  - `parse_json_data()`: Parse JSON files
  - `parse_csv_data()`: Parse CSV files
  - `extract_transactions_from_json()`: Extract transactions from JSON structure
  - `extract_gst_data()`: Extract GST-related data

- **transaction_categorizer.py**:
  - `categorize_transaction()`: Categorize single transaction
  - `categorize_all_transactions()`: Categorize transaction list
  - `detect_cashflow_patterns()`: Detect patterns and seasonality

- **financial_calculator.py**:
  - `compute_cashflow_metrics()`: Calculate inflow/outflow metrics
  - `compute_balance_metrics()`: Calculate balance statistics
  - `compute_stability_score()`: Calculate cashflow stability (0-1)
  - `detect_stress_indicators()`: Identify financial stress

- **anomaly_detector.py**:
  - `detect_anomalies()`: Find unusual transactions
  - `detect_red_flags()`: Identify lending red flags

### Agents (`agents/`)

- **financial_health_agent.py**: 
  - Extracts transactions
  - Categorizes transactions
  - Computes financial metrics
  - Detects patterns
  - Output: `FinancialHealthSummary`

- **credit_scoring_agent.py**:
  - Analyzes repayment patterns
  - Assesses concentration risk
  - Computes behavioral score (0-1000)
  - Detects anomalies
  - Output: `BehavioralScore`

- **policy_matching_agent.py**:
  - Loads lender policies
  - Evaluates product eligibility
  - Determines risk buckets
  - Calculates recommended amounts
  - Output: `ProductRecommendation`

- **explainability_agent.py**:
  - Explains scores in human language
  - Generates improvement recommendations
  - Creates lender arguments
  - Extracts insights
  - Output: `ExplainabilityReport`

### Orchestrator (`orchestrator/`)

- **orchestrator.py**:
  - Coordinates all agents
  - Executes pipeline sequentially
  - Merges outputs
  - Builds unified report
  - Handles errors gracefully

### Report Builder (`report_builder/`)

- **report_builder.py**:
  - `to_json()`: Convert to JSON string
  - `to_dict()`: Convert to dictionary
  - `to_summary()`: Extract summary
  - `format_for_lender()`: Lender-specific format
  - `format_for_msme()`: MSME-friendly format

### API (`api/`)

- **main.py**: FastAPI application
  - `POST /api/v1/analyze`: Trigger analysis
  - `GET /api/v1/report/{id}`: Get full report
  - `GET /api/v1/report/{id}/summary`: Get summary
  - `GET /api/v1/report/{id}/lender`: Lender view
  - `GET /api/v1/report/{id}/msme`: MSME view
  - `GET /health`: Health check

### Examples (`examples/`)

- **sample_data.json**: Sample transaction data for testing
- **run_end_to_end.py**: Complete end-to-end example script

---

## Key Design Patterns

1. **Agent-as-a-Service**: Each agent is independent with `run()` interface
2. **Tools vs Agents**: Clear separation - tools process data, agents reason
3. **Type Safety**: Pydantic models throughout
4. **Modularity**: Each component is independent and testable
5. **Orchestration**: Central orchestrator coordinates all agents

---

## Entry Points

1. **Direct Python**: `orchestrator.run(input_data, context)`
2. **REST API**: `POST /api/v1/analyze`
3. **Example Script**: `python -m agents_platform.examples.run_end_to_end`

---

**Total Files**: ~25 Python files + documentation + config

**Lines of Code**: ~3000+ lines of production-ready code

